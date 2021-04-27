
var firebaseConfig = {
  apiKey: "AIzaSyDeS59n5TKL298haOpc2Xlwyk2i0rVpCqw",
  authDomain: "dart-vax-dash.firebaseapp.com",
  projectId: "dart-vax-dash",
  storageBucket: "dart-vax-dash.appspot.com",
  messagingSenderId: "914479178760",
  appId: "1:914479178760:web:85d3eeb08b013989d89dbd",
  measurementId: "G-S7K05X1Q2W"
};

// Initialize Firebase
var app = firebase.initializeApp(firebaseConfig);
db = firebase.firestore(app);
// firebase.analytics();


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('/');
}

function todayDate(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  var today = dd + '/' + mm + '/' + yyyy;
  return today;
}


// entry object
  class Entry {
      constructor (dateTime, id, vaccineMf, dose,
       userName, doseDate) {
          this.dateTime = dateTime;
          this.vaccineMf = vaccineMf;
          this.dose = dose;
          this.doseDate = doseDate;
          // this.mCommodity = mCommodity;
          // this.mGradeType = mGradeType;
          // this.mandiName = mandiName;
          // this.mRate = mRate;
          // this.sellerName = sellerName;
          // this.mRemarks = mRemarks;
          this.id = id;
          // this.imageUrl = imageUrl;
          // this.mImageBytes = mImageBytes;
          this.userName = userName;
      }
      toString() {
          return this.dateTime + ', ' + this.userName + ', ' + this.vaccineMf + ', ' +
          this.dose + ', ' + this.doseDate;
      }
  }
  // Firestore data converter
  const entryConverter = {
    toFirestore: function(entry) {
      return {
          dateTime: entry.dateTime,      
          userName: entry.userName, 
          vaccineMf: entry.vaccineMf, 
          dose: entry.dose, 
          doseDate: entry.doseDate, 
          id: entry.id
      }
    },
    fromFirestore: function(snapshot, options){
      const data = snapshot.data(options);
      return new Entry(data.dateTime, data.id, data.userName, data.vaccineMf, data.dose,
        data.doseDate);
    }
  }

  class User {
    constructor (admin, name, uid) {
      this.admin = admin;
      this.name = name;
      this.uid = uid;
    }
    toString() {
      return this.admin + ", " + this.name + ", " + this.uid;
    }
  }

  const userConverter = {
    toFirestore: function(user) {
      return {
          admin: user.admin,
          name: user.name,
          uid: user.uid
      }
    },
    fromFirestore: function(snapshot, options){
      const data = snapshot.data(options);
      return new User(data.admin, data.name, data.uid);
    }
  }

  function getProcurementData() {
    $('#table-heading').text('Procurement');
    $('th').remove();
    $('tr').remove();
      var headers = '';
      headers += '<tr>';
      headers += '<th>Date</th>';
      headers += '<th>Commodity</th>';
      headers += '<th>Grade</th>';
      headers += '<th>Source</th>';
      headers += '<th>Rate (Rs./Kg)</th>';
      headers += '<th>Seller Name</th>';
      headers += '<th>Entry Officer</th>';
      headers += '<th>Remarks</th>';
      headers += '<th>Image Url</th>';
      headers += '<th>Entry Id</th>';
      headers += '</tr>';
      $('#app-header').append(headers);


      var userDocRef = db.collection("users").withConverter(userConverter)
      userDocRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if (doc.exists) {
            user = doc.data();
            // console.log("User data:", user.toString());
            var docRef = db.collection(user.uid).withConverter(entryConverter);
            docRef.get().then(function(querySnapshot) {
              var content = '';
              querySnapshot.forEach(function(doc) {
                if (doc.exists) {
                  entry = doc.data();
                  var link = entry.imageUrl === 'No Image Uploaded' ? "No Image Uploaded" : "Link";
                  content += '<tr>';
                  content += '<td>' + entry.dateTime + '</td>';
                  content += '<td>' + entry.mCommodity + '</td>';
                  content += '<td>' + entry.mGradeType + '</td>';
                  content += '<td>' + entry.mandiName + '</td>';
                  content += '<td>' + entry.mRate + '</td>';
                  content += '<td>' + entry.sellerName + '</td>';
                  content += '<td>' + entry.mUserName + '</td>';
                  content += '<td>' + entry.mRemarks + '</td>';
                  content += '<td>' + '<small> <a href=' + entry.imageUrl + '>' + link + '</a> </small>' + '</td>';
                  content += '<td>' + entry.id + '</td>';
                  content += '</tr>';
                  console.log("document data:", entry.toString());
                } else {
                  console.log("No such entry document");
                }
              });
              $('#app-table').append(content);
            });
          } else {
            console.log("No such user document");
          }
        });
      });
    }

  function getSellerData() {
      $('#table-heading').text('Sellers');
      $('th').remove();
      $('tr').remove();
      var headers = '';
      headers += '<tr>';
      headers += '<th>Name</th>';
      headers += '<th>Commodities</th>';
      headers += '<th>Phone No.</th>';
      headers += '<th>Mandi</th>';
      headers += '<th>Seller Id</th>';
      headers += '<th>Comments</th>';
      headers += '</tr>';
      $('#app-header').append(headers);
      var userDocRef = db.collection("sellers").withConverter(sellerConverter)
      userDocRef.get().then(function(querySnapshot) {
        var content = '';
        querySnapshot.forEach(function(doc) {
          if (doc.exists) {
            seller = doc.data();
            content += '<tr>';
            content += '<td>' + seller.name + '</td>';
            content += '<td>' + seller.commodities + '</td>';
            content += '<td>' + seller.phone + '</td>';
            content += '<td>' + seller.mandi + '</td>';
            content += '<td>' + seller.id + '</td>';
            content += '<td>' + seller.comments + '</td>';
            content += '</tr>';
            console.log("document data:", seller.toString());
          } else {
              console.log("No such entry document");
          }
        });
        $('#app-table').append(content);
      });
    }

    function getUserData(){
      $('#table-heading').text('Users');
      $('th').remove();
      $('tr').remove();
      var headers = '';
      headers += '<tr>';
      headers += '<th>Name</th>';
      headers += '<th>isAdmin</th>';
      headers += '<th>uid</th>';
      headers += '</tr>';
      $('#app-header').append(headers);
      var userDocRef = db.collection("users").withConverter(userConverter)
      userDocRef.get().then(function(querySnapshot) {
        var content = '';
        querySnapshot.forEach(function(doc) {
          if (doc.exists) {
            user = doc.data();
            content += '<tr>';
            content += '<td>' + user.name + '</td>';
            content += '<td>' + user.admin + '</td>';
            content += '<td>' + user.uid + '</td>';
            content += '</tr>';
            console.log("document data:", user.toString());
          } else {
              console.log("No such entry document");
          }
        });
        $('#app-table').append(content);
      });
    }


  class Input_Entry {
      constructor (date, commodity,
        max_price, min_price, modal_price,  mandiName, state, district) {
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
          return this.date + ', ' + this.commodity  + ', ' + this.mandiName + ', ' + this.max_price + ', ' + this.min_price + ', ' + this.modal_price + ', ' + this.state + ', ' + this.district;
      }
  }

var dict = {};
async function loadAPIData(){
  var input_entries = [];

  var url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001dc3f71fc0ef349a74345a9370672b1f6&format=json&limit=50";
  fetch(url)
  .then(response => response.json())
  .then(function(data){
    data.records.forEach(function(record){
      input_entries.push(new Input_Entry(record.arrival_date, record.commodity, record.max_price, record.min_price,
        record.modal_price, record.market, record.state, record.district));
    });
  });

  return input_entries;
}

async function getAllEntries(){
  var all_entries = [];
  var userDocRef = db.collection("users").withConverter(userConverter)
  userDocRef.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      if (doc.exists) {
        user = doc.data();
        // console.log("User data:", user.toString());
        var docRef = db.collection(user.uid).withConverter(entryConverter);
        docRef.get().then(function(querySnapshot) {
          var content = '';
          querySnapshot.forEach(function(doc) {
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

  all_entries.forEach(function(doc){
    console.log(doc.toString());
   });

  // return today_entries;
}

async function getInputData(){
  $('#table-heading').text('Input Data');
  $('th').remove();
  $('tr').remove();
  var headers = '';
  headers += '<tr>';
  headers += '<th>Vegetable / Fruit</th>';
  headers += '<th>Farmer Price</th>';
  headers += '<th>AGMarkNet Price</th>';
  headers += '<th>Azadpur</th>';
  headers += '<th>Okhla</th>';
  headers += '<th>Ghazipur</th>';
  headers += '<th>Hapur</th>';
  headers += '<th>Amroha</th>';
  headers += '<th>Siyana</th>';
  $('#app-header').append(headers);

  var input_entries = await loadAPIData();
  console.log("input_entries", input_entries);



  // var today_entries = await getAllEntries();
  // console.log("today_entries", today_entries);

  // await getTodayEntries();

  var all_entries = await getAllEntries();

  all_entries.forEach(function(doc){
    console.log(doc.toString());
   });

}


function getOutputData(){
  $('#table-heading').text('Output Data');
  $('th').remove();
  $('tr').remove();
}

var procurement = document.getElementById('procurement');
var seller = document.getElementById('seller');
var user = document.getElementById('user');
var input = document.getElementById('input');
var output = document.getElementById('output');
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
