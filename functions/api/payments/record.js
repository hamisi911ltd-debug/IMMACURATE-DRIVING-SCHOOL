// POST /api/payments/record
// Record a new payment

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    
    // Validate required fields
    if (!data.student || !data.amount || !data.method) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Get next receipt number
    const receiptSetting = await context.env.DB.prepare(
      'SELECT setting_value FROM system_settings WHERE setting_key = ?'
    ).bind('receipt_counter').first();
    
    const receiptNumber = String(receiptSetting?.setting_value || 1).padStart(3, '0');
    const paymentId = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Record payment
    await context.env.DB.prepare(`
      INSERT INTO payments (
        payment_id, receipt_number, student_id, amount, 
        payment_method, payment_type, reference_number, 
        status, processed_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', 'admin-001')
    `).bind(
      paymentId,
      receiptNumber,
      data.student,
      data.amount,
      data.method,
      data.paymentType || 'tuition',
      data.reference || ''
    ).run();

    // Update receipt counter
    const nextCounter = parseInt(receiptSetting?.setting_value || 1) + 1;
    await context.env.DB.prepare(
      'UPDATE system_settings SET setting_value = ? WHERE setting_key = ?'
    ).bind(String(nextCounter), 'receipt_counter').run();

    // Update student balance
    const balance = await context.env.DB.prepare(
      'SELECT * FROM student_balances WHERE student_id = ?'
    ).bind(data.student).first();

    if (balance) {
      const newTotalPaid = parseFloat(balance.total_paid || 0) + parseFloat(data.amount);
      const newBalanceDue = parseFloat(balance.total_fees || 0) - newTotalPaid;
      const newStatus = newBalanceDue <= 0 ? 'paid-in-full' : 'current';

      await context.env.DB.prepare(`
        UPDATE student_balances 
        SET total_paid = ?, last_payment_date = DATE('now'), status = ?
        WHERE student_id = ?
      `).bind(newTotalPaid, newStatus, data.student).run();
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment recorded successfully',
      paymentId: paymentId,
      receiptNumber: receiptNumber
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}