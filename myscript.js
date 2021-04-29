var firebaseConfig = {
  apiKey: "AIzaSyDeS59n5TKL298haOpc2Xlwyk2i0rVpCqw",
  authDomain: "dart-vax-dash.firebaseapp.com",
  projectId: "dart-vax-dash",
  storageBucket: "dart-vax-dash.appspot.com",
  messagingSenderId: "914479178760",
  appId: "1:914479178760:web:85d3eeb08b013989d89dbd",
  measurementId: "G-S7K05X1Q2W",
};

// Initialize Firebase
var app = firebase.initializeApp(firebaseConfig);
db = firebase.firestore(app);
readFromFirebase();
// firebase.analytics();

function readFromFirebase() {
  var totalsDoc = db.collection("totals").doc("totalsDoc");
  var firstOn, firstOff, secondOn, secondOff;

  totalsDoc
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        firstOn = doc.data().firstOn;
        firstOff = doc.data().firstOff;
        secondOff = doc.data().secondOff;
        secondOn = doc.data().secondOn;
        document.getElementById("firstOn").innerHTML = firstOn;
        document.getElementById("firstOff").innerHTML = firstOff;
        document.getElementById("secondOn").innerHTML = secondOn;
        document.getElementById("secondOff").innerHTML = secondOff;
        console.log(type(secondOn))
        document.getElementById("firstTotal").innerHTML = firstOn + secondOn;
        document.getElementById("secondTotal").innerHTML = firstOff + secondOff;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

function writeToFirebase(vaccineMf, dose, doseDate, name, onCampus) {
  emailAddress = firebase.auth().currentUser.email;
  const regex = new RegExp("^[A-Za-z0-9._%+-]+@dartmouth.edu$");
  dartmouthUser = regex.test(emailAddress);
  if (dartmouthUser) {
    console.log(dartmouthUser, "Is dart user");
    dateTime = Date.now();
    db.collection("vaccineEntries")
      .doc(firebase.auth().currentUser.email)
      .set({
        name: name,
        dateTime: dateTime,
        vaccineMf: vaccineMf,
        dose: dose,
        doseDate: doseDate,
        onCampus: onCampus,
      })
      .then(() => {
        console.log("Document successfully written!");
        alert(
          "Thanks! Your response has been recorded. \n \n Just to let you know, you don't have to update your vaccination records when/if you have to get a second dose. We got it! "
        );
        readFromFirebase();
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
        alert("Hmmm seems like there was an error. Please try again!");
      });
  } else {
    alert(
      "Hi! Sorry but you need to login using a Dartmouth email address to enter vaccination information"
    );
    // let dialog = document.getElementById("dialogBox");
    // var x = document.getElementById("dialogBox");
    // x.style.display = "block";
    // setTimeout(function () {
    //   alert("Hello");
    //   x.style.display = "none";
    // }, 3000);
    // dialog.show()
  }
}

function signout() {
  console.log("Tryna sign out");
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("logged out");
    })
    .catch((error) => {
      console.log("wait, could not sign out");
    });
}
var signOutButton = document.querySelector("#signOut");
signOutButton.addEventListener("click", () => {
  signout();
});

// var computed = false;

var submitFormButton = document.querySelector("#formSubmitButton");
submitFormButton.addEventListener("click", () => {
  console.log("Writing entry to firebase");
  var formNameInput = document.getElementById("formName").value;
  var formOnCampus = document.getElementById("formOnCampus").value;
  var formVaccineMf = document.getElementById("formVaccineMf").value;
  var formOnCampus = document.getElementById("formOnCampus").value;
  var formDoseDate = document.getElementById("formDoseDate").value;
  var formDose = document.getElementById("formDose").value;

  emailAddress = firebase.auth().currentUser.email;
  const userRef = db.collection("vaccineEntries").doc(emailAddress);

  userRef.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      userRef.onSnapshot((doc) => {
        // do stuff with the data
        console.log("Already exists");
        alert("Hi, you are already in our records!");
        // TODO: Remove this
      });
    } else {
      writeToFirebase(
        formVaccineMf,
        formDose,
        formDoseDate,
        formNameInput,
        formOnCampus
      );
      console.log("COMP");
      computeTotals();
    }
  });
});

function computeTotals() {
  var userRef = firebase.auth().currentUser.email;
  console.log("Updating total");
  db.collection("vaccineEntries")
    .doc(userRef)
    .get()
    .then((doc) => {
      if (doc.exists && !doc.data().updated) {
        if (doc.data().dose == "first") {
          if (doc.data().onCampus == "On-Campus") {
            db.collection("totals")
              .doc("totalsDoc")
              .update({
                firstOn: firebase.firestore.FieldValue.increment(1),
              });
          } else {
            db.collection("totals")
              .doc("totalsDoc")
              .update({
                firstOff: firebase.firestore.FieldValue.increment(1),
              });
          }
        } else if (doc.data().dose == "second") {
          if (doc.data().onCampus == "On-Campus") {
            db.collection("totals")
              .doc("totalsDoc")
              .update({
                secondOn: firebase.firestore.FieldValue.increment(1),
              });
          } else {
            db.collection("totals")
              .doc("totalsDoc")
              .update({
                secondOff: firebase.firestore.FieldValue.increment(1),
              });
          }
        }
      }
    });
  // totals = [0, 0, 0, 0]
  // db.collection("vaccineEntries").get().then((querySnapshot) => {
  //   querySnapshot.forEach((doc) => {
  //     if(doc.data().dose == "first") {
  //       console.log("first");
  //       if(doc.data().onCampus == "On-Campus"){
  //         totals[0] = totals[0] + 1;
  //       } else {
  //         totals[1]++;
  //       }
  //       } else if (doc.data().dose == "second") {
  //         console.log("second");
  //         if(doc.data().onCampus == "On-Campus"){
  //           totals[2]++;
  //         } else {
  //           totals[3]++;
  //         }
  //       }
  //   });
  // });

  // db.collection("totals").doc("totalsDoc").set({
  //   firstOn: totals[0],
  //   firstOff: totals[1],
  //   secondOn: totals[2],
  //   secondOff: totals[3]
  // }).then(() => {
  //   console.log("Totals successfully computed");
  // })
  // .catch((error) => {
  //   console.error("Error writing totals: ", error);
  // });
}

// entry object
class Entry {
  constructor(dateTime, id, vaccineMf, dose, userName, doseDate) {
    this.dateTime = dateTime;
    this.vaccineMf = vaccineMf;
    this.dose = dose;
    this.doseDate = doseDate;
    this.id = id;
    z;
    this.userName = userName;

    // this.mCommodity = mCommodity;
    // this.mGradeType = mGradeType;
    // this.mandiName = mandiName;
    // this.mRate = mRate;
    // this.sellerName = sellerName;
    // this.mRemarks = mRemarks;
    // this.imageUrl = imageUrl;
    // this.mImageBytes = mImageBytes;
  }
  toString() {
    return (
      this.dateTime +
      ", " +
      this.userName +
      ", " +
      this.vaccineMf +
      ", " +
      this.dose +
      ", " +
      this.doseDate
    );
  }
}
// Firestore data converter
const entryConverter = {
  toFirestore: function (entry) {
    return {
      dateTime: entry.dateTime,
      userName: entry.userName,
      vaccineMf: entry.vaccineMf,
      dose: entry.dose,
      doseDate: entry.doseDate,
      id: entry.id,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new Entry(
      data.dateTime,
      data.id,
      data.userName,
      data.vaccineMf,
      data.dose,
      data.doseDate
    );
  },
};

class User {
  constructor(admin, name, uid) {
    this.admin = admin;
    this.name = name;
    this.uid = uid;
  }
  toString() {
    return this.admin + ", " + this.name + ", " + this.uid;
  }
}

const userConverter = {
  toFirestore: function (user) {
    return {
      admin: user.admin,
      name: user.name,
      uid: user.uid,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new User(data.admin, data.name, data.uid);
  },
};

function getProcurementData() {
  $("#table-heading").text("Data");
  $("th").remove();
  $("tr").remove();
  var headers = "";
  headers += "<tr>";
  headers += "<th># Vaccinated Dose</th>";
  headers += "<th>On Campus</th>";
  headers += "<th>Off Campus</th>";
  /* headers += "<th>% </th>";
  headers += "<th>Rate (Rs./Kg)</th>";
  headers += "<th>Seller Name</th>";
  headers += "<th>Entry Officer</th>";
  headers += "<th>Remarks</th>";
  headers += "<th>Image Url</th>";
  headers += "<th>Entry Id</th>"; */
  headers += "</tr>";
  $("#app-header").append(headers);

  var userDocRef = db.collection("users").withConverter(userConverter);
  userDocRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      if (doc.exists) {
        user = doc.data();
        // console.log("User data:", user.toString());
        var docRef = db.collection(user.uid).withConverter(entryConverter);
        docRef.get().then(function (querySnapshot) {
          var content = "";
          querySnapshot.forEach(function (doc) {
            if (doc.exists) {
              entry = doc.data();
              var link =
                entry.imageUrl === "No Image Uploaded"
                  ? "No Image Uploaded"
                  : "Link";
              content +=
                "<tr>"; /* 
              content += "<td>" + First Dose + "</td>";
              content += "<td>" + Second Dose  + "</td>"; */
              content += "<td>" + entry.mGradeType + "</td>";
              content += "<td>" + entry.mandiName + "</td>";
              content += "<td>" + entry.mRate + "</td>";
              content += "<td>" + entry.sellerName + "</td>";
              content += "<td>" + entry.mUserName + "</td>";
              content += "<td>" + entry.mRemarks + "</td>";
              content +=
                "<td>" +
                "<small> <a href=" +
                entry.imageUrl +
                ">" +
                link +
                "</a> </small>" +
                "</td>";
              content += "<td>" + entry.id + "</td>";
              content += "</tr>";
              console.log("document data:", entry.toString());
            } else {
              console.log("No such entry document");
            }
          });
          $("#app-table").append(content);
        });
      } else {
        console.log("No such user document");
      }
    });
  });
}

function getSellerData() {
  $("#table-heading").text("Sellers");
  $("th").remove();
  $("tr").remove();
  var headers = "";
  headers += "<tr>";
  headers += "<th>Name</th>";
  headers += "<th>Commodities</th>";
  headers += "<th>Phone No.</th>";
  headers += "<th>Mandi</th>";
  headers += "<th>Seller Id</th>";
  headers += "<th>Comments</th>";
  headers += "</tr>";
  $("#app-header").append(headers);
  var userDocRef = db.collection("sellers").withConverter(sellerConverter);
  userDocRef.get().then(function (querySnapshot) {
    var content = "";
    querySnapshot.forEach(function (doc) {
      if (doc.exists) {
        seller = doc.data();
        content += "<tr>";
        content += "<td>" + seller.name + "</td>";
        content += "<td>" + seller.commodities + "</td>";
        content += "<td>" + seller.phone + "</td>";
        content += "<td>" + seller.mandi + "</td>";
        content += "<td>" + seller.id + "</td>";
        content += "<td>" + seller.comments + "</td>";
        content += "</tr>";
        console.log("document data:", seller.toString());
      } else {
        console.log("No such entry document");
      }
    });
    $("#app-table").append(content);
  });
}

function getUserData() {
  $("#table-heading").text("Users");
  $("th").remove();
  $("tr").remove();
  var headers = "";
  headers += "<tr>";
  headers += "<th>Name</th>";
  headers += "<th>isAdmin</th>";
  headers += "<th>uid</th>";
  headers += "</tr>";
  $("#app-header").append(headers);
  var userDocRef = db.collection("users").withConverter(userConverter);
  userDocRef.get().then(function (querySnapshot) {
    var content = "";
    querySnapshot.forEach(function (doc) {
      if (doc.exists) {
        user = doc.data();
        content += "<tr>";
        content += "<td>" + user.name + "</td>";
        content += "<td>" + user.admin + "</td>";
        content += "<td>" + user.uid + "</td>";
        content += "</tr>";
        console.log("document data:", user.toString());
      } else {
        console.log("No such entry document");
      }
    });
    $("#app-table").append(content);
  });
}

class Input_Entry {
  constructor(
    date,
    commodity,
    max_price,
    min_price,
    modal_price,
    mandiName,
    state,
    district
  ) {
    this.date = date;
    this.commodity = commodity;
    this.max_price = max_price;
    this.min_price = min_price;
    this.modal_price = modal_price;
    this.mandiName = mandiName;
    this.state = state;
    this.district = district;
  }
  toString() {
    return (
      this.date +
      ", " +
      this.commodity +
      ", " +
      this.mandiName +
      ", " +
      this.max_price +
      ", " +
      this.min_price +
      ", " +
      this.modal_price +
      ", " +
      this.state +
      ", " +
      this.district
    );
  }
}

var dict = {};
async function loadAPIData() {
  var input_entries = [];

  var url =
    "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001dc3f71fc0ef349a74345a9370672b1f6&format=json&limit=50";
  fetch(url)
    .then((response) => response.json())
    .then(function (data) {
      data.records.forEach(function (record) {
        input_entries.push(
          new Input_Entry(
            record.arrival_date,
            record.commodity,
            record.max_price,
            record.min_price,
            record.modal_price,
            record.market,
            record.state,
            record.district
          )
        );
      });
    });

  return input_entries;
}

async function getAllEntries() {
  var all_entries = [];
  var userDocRef = db.collection("users").withConverter(userConverter);
  userDocRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      if (doc.exists) {
        user = doc.data();
        // console.log("User data:", user.toString());
        var docRef = db.collection(user.uid).withConverter(entryConverter);
        docRef.get().then(function (querySnapshot) {
          var content = "";
          querySnapshot.forEach(function (doc) {
            if (doc.exists) {
              entry = doc.data();
              all_entries.push(entry);
              // console.log("document data:", entry.toString());
            } else {
              console.log("No such entry document");
            }
          });
        });
      } else {
        console.log("No such user document");
      }
    });
  });

  return all_entries;
}

async function getTodayEntries() {
  var today_entries = [];
  var all_entries = await getAllEntries();

  all_entries.forEach(function (doc) {
    console.log(doc.toString());
  });

  // return today_entries;
}

async function getInputData() {
  $("#table-heading").text("Input Data");
  $("th").remove();
  $("tr").remove();
  var headers = "";
  headers += "<tr>";
  headers += "<th>Vegetable / Fruit</th>";
  headers += "<th>Farmer Price</th>";
  headers += "<th>AGMarkNet Price</th>";
  headers += "<th>Azadpur</th>";
  headers += "<th>Okhla</th>";
  headers += "<th>Ghazipur</th>";
  headers += "<th>Hapur</th>";
  headers += "<th>Amroha</th>";
  headers += "<th>Siyana</th>";
  $("#app-header").append(headers);

  var input_entries = await loadAPIData();
  console.log("input_entries", input_entries);

  // var today_entries = await getAllEntries();
  // console.log("today_entries", today_entries);

  // await getTodayEntries();

  var all_entries = await getAllEntries();

  all_entries.forEach(function (doc) {
    console.log(doc.toString());
  });
}

function getOutputData() {
  $("#table-heading").text("Output Data");
  $("th").remove();
  $("tr").remove();
}

var procurement = document.getElementById("procurement");
var seller = document.getElementById("seller");
var user = document.getElementById("user");
var input = document.getElementById("input");
var output = document.getElementById("output");
procurement.addEventListener("click", getProcurementData);
seller.addEventListener("click", getSellerData);
user.addEventListener("click", getUserData);
input.addEventListener("click", getInputData);
output.addEventListener("click", getOutputData);

//   function addContent(item, index) {
//       content += '<tr>';
//       content += '<td>' + item.dateTime + '</td'>;
//       content += '<td>' + item.mCommodity + '</td'>;
//       content += '<td>' + item.mGradeType + '</td'>;
//       content += '<td>' + item.mandiName + '</td'>;
//       content += '<td>' + item.mRate + '</td'>;
//       content += '<td>' + item.sellerName + '</td'>;
//       content += '<td>' + item.mUserName + '</td'>;
//       content += '<td>' + item.mRemarks + '</td'>;
//       content += '</tr>';
//       $('#app-table').append(content);
//       // document.getElementById("demo").innerHTML += index + ":" + item + "<br>";
// }

// function readData(item, index) {
//   var docRef = db.collection(item.uid).withConverter(entryConverter);
//   docRef.get().then(function(querySnapshot) {
//       var content = '';
//       querySnapshot.forEach(function(doc) {
//         if (doc.exists) {
//           user = doc.data();
//           content += '<tr>';
//           content += '<td>' + user.dateTime + '</td>';
//           content += '<td>' + user.mCommodity + '</td>';
//           content += '<td>' + user.mGradeType + '</td>';
//           content += '<td>' + user.mandiName + '</td>';
//           content += '<td>' + user.mRate + '</td>';
//           content += '<td>' + user.sellerName + '</td>';
//           content += '<td>' + user.mUserName + '</td>';
//           content += '<td>' + user.mRemarks + '</td>';
//           content += '</tr>';
//           console.log("document data:", user.toString());
//         } else {
//           // doc.data() will be undefined in this case
//           console.log("No such document!");
//         }
//     });
//     $('#app-table').append(content);
//   });
// }
//
//   users.forEach(readData);

// var docRef = db.collection("DvhITrzfdrWy8OYk9lc6PdoeZGB2").withConverter(entryConverter);
//
// docRef.get().then(function(querySnapshot) {
//     querySnapshot.forEach(function(doc) {
//     if (doc.exists) {
//         console.log("Document data:", doc.data());
//     } else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//     }
//   });
// });
