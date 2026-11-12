/**
 * Karachi Eats - WhatsApp Order Gateway
 */
import { APP_CONFIG } from './config.js';
import { formatPKR } from './utils.js';

export function generateWhatsAppOrderUrl(order) {
  const itemsText = order.items
    .map((item, idx) => `  ${idx + 1}. *${item.name}* x ${item.quantity} = ${formatPKR(item.price * item.quantity)}`)
    .join('\n');

  const message = 
`🍔 *NEW ORDER — KARACHI EATS* 🇵🇰
━━━━━━━━━━━━━━━━━━━━
🆔 *Order ID:* #${order.id}
🏪 *Restaurant:* ${order.restaurantName}
📅 *Date:* ${new Date(order.createdAt).toLocaleString('en-PK')}

📦 *ITEMS ORDERED:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━
💰 *Subtotal:* ${formatPKR(order.subtotal)}
🛵 *Delivery Fee:* ${formatPKR(order.deliveryFee)}
🏷️ *Discount:* -${formatPKR(order.discount)}
🏛️ *Sindh Sales Tax (5%):* ${formatPKR(order.tax)}
💳 *TOTAL PAYABLE:* *${formatPKR(order.total)}*
💵 *Payment Method:* ${order.paymentMethod}

━━━━━━━━━━━━━━━━━━━━
👤 *CUSTOMER DETAILS:*
• *Name:* ${order.customer.name}
• *Phone:* ${order.customer.phone}
• *Area:* ${order.customer.area}
• *Address:* ${order.customer.address}
${order.customer.mapLink ? `• *Location Link:* ${order.customer.mapLink}\n` : ''}
${order.customer.notes ? `• *Notes:* _${order.customer.notes}_\n` : ''}
━━━━━━━━━━━━━━━━━━━━
_Thank you for ordering with Karachi Eats!_`;

  const encoded = encodeURIComponent(message);
  const phone = APP_CONFIG.businessWhatsApp.replace(/[^0-9]/g, '');
  return `https://wa.me/${phone}?text=${encoded}`;
}
