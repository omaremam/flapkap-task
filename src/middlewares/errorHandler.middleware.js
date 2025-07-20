const errorHandler = (err, req, res, next) => {
  // Log the error with full stack trace
  console.error('\n🚨 APPLICATION ERROR DETECTED:');
  console.error('='.repeat(60));
  console.error(`📅 Timestamp: ${new Date().toISOString()}`);
  console.error(`🌐 Method: ${req.method}`);
  console.error(`📍 URL: ${req.originalUrl}`);
  console.error(`👤 User ID: ${req.user ? req.user.id : 'Not authenticated'}`);
  console.error(`📝 Error Message: ${err.message}`);
  console.error(`🔢 Status Code: ${err.status || 500}`);
  
  // Log the full stack trace
  if (err.stack) {
    console.error('\n🔍 FULL STACK TRACE:');
    console.error(err.stack);
  }
  
  // Log request details for debugging
  console.error('\n📋 REQUEST DETAILS:');
  console.error(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
  console.error(`Body: ${JSON.stringify(req.body, null, 2)}`);
  console.error(`Query: ${JSON.stringify(req.query, null, 2)}`);
  console.error(`Params: ${JSON.stringify(req.params, null, 2)}`);
  
  console.error('='.repeat(60) + '\n');

  // Send error response to client
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
};

module.exports = errorHandler; 