const generateEmailTemplate = code => `
<!DOCTYPE html><html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Soundest Verification</title><style>/* your styles here */</style></head>
<body>
  <div class="container">
    <div class="header"><img src="file:///d%3A/react%20project/music-app/srver/utils/1000081518-removebg-preview.png" alt="Soundest logo" width="400" height="300"></div>
    <div class="body">
      <h2>Your verification code</h2>
      <p>Use the code below to verify your email:</p>
      <div class="otp-box">${code}</div>
      <p>This code expires in 5 minutes.</p>
    </div>
    <div class="footer">&copy; 2025 Soundest</div>
  </div>
</body></html>`;
module.exports = generateEmailTemplate;
