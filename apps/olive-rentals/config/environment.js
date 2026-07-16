const path = require('path');
const dotenv = require('dotenv');

const envFile = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envFile });

const nodeEnv = process.env.NODE_ENV || 'development';
const port = Number(process.env.PORT || 3002);
const processedMessageTtlMinutes = Number(process.env.PROCESSED_MESSAGE_TTL_MINUTES || 60);

const meta = {
  verifyToken: process.env.VERIFY_TOKEN || 'replace_with_private_verify_token',
  accessToken: process.env.WHATSAPP_TOKEN || '',
  phoneNumberId: process.env.PHONE_NUMBER_ID || 'phone-number-id-placeholder',
  businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || 'waba-id-placeholder',
  graphApiVersion: process.env.GRAPH_API_VERSION || 'v25.0'
};

const defaultContext = {
  organizationId: process.env.DEFAULT_ORGANIZATION_ID || 'org-daniel-rentals',
  businessUnitId: process.env.DEFAULT_BUSINESS_UNIT_ID || 'business-unit-main',
  productId: process.env.PRODUCT_ID || 'olive-rentals'
};

const sessionTtlMinutes = Number(process.env.SESSION_TTL_MINUTES || 30);

module.exports = {
  nodeEnv,
  port,
  meta,
  defaultContext,
  processedMessageTtlMinutes,
  sessionTtlMinutes
};
