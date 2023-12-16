const User = require("../models/userModel");

const saveLog = async (JSONData) => {
  // console.log("jsonData email : ", JSONData.email);
  const user = await User.findOne({ email: JSONData.email });
  // console.log("user: ", user);
  const log = {
    data: JSONData.data,
    date: Date.now(),
  };

  const today = new Date();

  /// ilk hive ekleme islemi
  if (!user.hives) {
    user.hives = { [JSONData.hive]: {} };
    user.hives[JSONData.hive] = {...user.hives[JSONData.hive],['last24hour']:[]};
    user.hives[JSONData.hive] = {
      ...user.hives[JSONData.hive],
      [today.getFullYear()]: {
        [today.getMonth() + 1]: { [today.getDate()]: [log] },
      },
    };

    user.markModified("hives");
    await user.save();
  }

  if (user.hives[JSONData.hive]) {
    console.log("hive");

    //hive var ise buraya gelir!!

    if (user.hives[JSONData.hive][today.getFullYear()]) {
      console.log("yil");
      // yil bilgisi var ise buraya gelir

      if (
        user.hives[JSONData.hive][today.getFullYear()][today.getMonth() + 1]
      ) {
        console.log("ay");
        /// ay bilgisi var ise buraya gelir

        if (
          user.hives[JSONData.hive][today.getFullYear()][today.getMonth() + 1][
            today.getDate()
          ]
        ) {
          console.log("gun");
          //gun bilgisi var ise buraya gelir

          console.log("buraya dustu..");
          user.hives[JSONData.hive][today.getFullYear()][today.getMonth() + 1][
            today.getDate()
          ].push(log);

          user.markModified("hives");
          await user.save();
        } else {
          console.log("!gun");
          // gun bilgisi yok ise buraya gelir

          user.hives[JSONData.hive][today.getFullYear()][today.getMonth() + 1] =
            {
              ...user.hives[JSONData.hive][today.getFullYear()][
                today.getMonth() + 1
              ],
              [today.getDate()]: [log],
            };
          user.markModified("hives");
          await user.save();
        }
      } else {
        // ay bilgisi yok ise buraya gelir

        console.log("!ay");
        user.hives[JSONData.hive][today.getFullYear()] = {
          ...user.hives[JSONData.hive][today.getFullYear()],
          [today.getMonth() + 1]: { [today.getDate()]: [log] },
        };
        console.log(user.hives[JSONData.hive][today.getFullYear()]);
        console.log("ay ekleme", user.hives[JSONData.hive]);

        const mark = JSONData.hive;

        user.markModified("hives");
        await user.save();
      }
    } else {
      // yil bilgisi yoksa buraya gelir

      console.log("!yil");
      user.hives[JSONData.hive] = {
        ...user.hives[JSONData.hive],
        [today.getFullYear()]: {
          [today.getMonth() + 1]: { [today.getDate()]: [log] },
        },
      };

      console.log("yil ekleme", user.hives[JSONData.hive]);
      user.markModified("hives");
      await user.save();
    }
  } else {
  }
};

const last24Hour = async (JSONData) => {
  // console.log("jsonData email : ", JSONData.email);
  console.log("lsat24calisti..................")
  const user = await User.findOne({ email: JSONData.email });
  // console.log("user: ", user);
  const log = {
    data: JSONData.data,
    date: Date.now(),
  };

  const today = new Date();
  console.log(user.hives[JSONData.hive])
  if (user.hives[JSONData.hive]['last24hour']) {
    //last24hour var ise buraya duser
    console.log("last24hour");

    user.hives[JSONData.hive]['last24hour'].push({ log });

    if (user.hives[JSONData.hive]['last24hour'].length > 24) {
      user.hives[JSONData.hive]['last24hour'].shift();
      console.log("eleman silindi");
      //tarih kaydina gore senkronize calisiyor mu bak!
      //////////////////
      //////////////////
      ///////////////////
      //////////////////
      /////////////////           SENKRONIZASYONU KONTROL ET !!!!!!!!!!!!!!!!!
      /////////////////
      /////////////////////
      ////////////////////
      ///////////////////
      ///////////////////
    }

    user.markModified("hives");
    await user.save();
  } else {
    //last24hour yok ise eger buraya duser

    console.log("!last24hour");

    user.hives[JSONData.hive] = {
      ...user.hives[JSONData.hive],
      ['last24hour']: [log],
    };

    user.markModified("hives");

    await user.save();
  }
};

const sendSMS = async (JSONData) => {
  console.log("jsonData email : ", JSONData.email);
  const user = await User.findOne({ email: JSONData.email });
  console.log("user: ", user);
  const log = {
    data: JSONData.data,
    date: Date.now(),
  };


  if (log.data.hayvan) {
    var request = require("request");
    var options = {
      method: "POST",
      url: "https://api.netgsm.com.tr/sms/send/get/",
      headers: {
        Cookie: "PHPSESSID=c5da9b1545a9e15e63140c5779c66f0a",
      },
      formData: {
        usercode: "2626061831",
        password: "a123456$",
        gsmno: "5320519820",
        message: '"saldiri vaaaar111111"',
        msgheader: "beeehive",
        startdate: "",
        dil: '"TR"',
        filter: '"0"',
        appkey: "",
      },
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });
  }
};

module.exports = {
  saveLog,
  last24Hour,
  sendSMS,
};
