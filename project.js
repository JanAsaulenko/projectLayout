var API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImI3MThjN2UyYmZkOTVkNTVkMGE2YWQwYWNhY2E0MzY0OTc2OWVjYjhlNGQ1NTEwMzkwZTU2NGVjODg3N2Y5ODllMWYyMDJlOGU3ZmEwN2IxIn0.eyJhdWQiOiIxMCIsImp0aSI6ImI3MThjN2UyYmZkOTVkNTVkMGE2YWQwYWNhY2E0MzY0OTc2OWVjYjhlNGQ1NTEwMzkwZTU2NGVjODg3N2Y5ODllMWYyMDJlOGU3ZmEwN2IxIiwiaWF0IjoxNTIwMjQ2MzQ4LCJuYmYiOjE1MjAyNDYzNDgsImV4cCI6MTgzNTg2NTU0OCwic3ViIjoiMTA4MCIsInNjb3BlcyI6WyJ1c2VyQmFzZUluZm8iLCJ1c2VyRGV0YWlsZWRJbmZvIiwidXNlckNvdXJzZUluZm8iXX0.1WoBVl3KC8Q0XSiXv6syKM_KOzm0xkAo7-tX8wnIpkPu3vzd-vDhfYfHKNypuRxJ0Qi2XLp9Ltwe0OwiTfH_k11FQxrjcXErjTeeEhAhc4Ggmtm3d-UL4cENmNwf8KXbuemxIDHI_0WWMhTQNnUamYEuJIL193oopWUuG7cxB-58lj6vTBA2SJaBFMahRU-sjmnDNnUGNeLE_uVs2bs_6Q5YTm-aszSpL6AH-8quS3cR3HlaRNxLPhdHzTUaUBEyi8ZxcMqM8KP6zOZyIK4mLeNqxPUSRH6aLsdC03ooe-0W41nSwq_5E6pyYVpPF3BxVOUUjClIUtqqT_7lmi9bPJqXw86FFEanMxRzWDYAeZcB7Fz_WnJioWDhh3HZLSgyfkfhZYmpVNtaxwUR5uKSNmQo5fUfsQr8gxMLfpcmlemXcyEBj1GvFfIP5up8rjAoFCNz9V6prHbMysmgmOv1TaAc8Ov5afOqEReJwm4vlK1fGcW-25N5nz9FeItdKjkWIHKpDb4RLXm1bajD_aTTeoopp_L0DaEI9dulD-Q2dMh66Nl0ejwwLYnQQzOMs9iXjVGdEt8PN6tD9bmUW-jWhwoxdVC5ISxs0aHFAH0R70PWyp8WSDCEb9hhSlmWHUYHZrd2spR1BuMxBx56_30otkVdD1tSnMr2wOFif96lQBg'; // here you have to put your personal token
var client = new INTITAClient({key: API_KEY}); // creating client instance


insertUserDetails();
createCourses();


function insertUserDetails() {
    new Promise((resolve, reject) => {
        client.getUserDetails(function (error, data) {
            if (error) {
                return reject(error)
            }
            else {
                resolve(data)
            }
        });

    }).then(data => {
        let nameEl = document.getElementById('name');
        nameEl.innerText = data.firstName + ' ' + data.secondName;
        let avatar = document.getElementById("avatar");
        avatar.src = data.avatar;
        let years = document.getElementById("years");
        years.innerText = data.birthday;
        let phone = document.getElementById("phone");
        phone.innerText = data.phone;
        let email = document.getElementById('email');
        email.innerText = data.email;
        let ed = document.getElementById("Education_form");
        ed.innerText = data.educationForm;
        let state = document.getElementById("Country");
        state.innerText = data.country;
        let city = document.getElementById('city');
        city.innerText = data.city;
        document.getElementById('train').innerText = data.trainers[0].firstName + " " + data.trainers[0].secondName;
        document.getElementById('tr_email').innerText = data.trainers[0].email;
    }).catch(error => {
        console.error(error.message);
    })
}

function createAccordion(idcourse) {
    new Promise((resolve, reject) => {
        client.getCourseModules(idcourse, function (error, data) {
            if (error) {
                return reject(error);
            }
            else {
                return resolve(data);
            }
        })
    }).then(data => {
        const accordion = document.getElementById('accordion');
        data.forEach(function (value, key) {
            const selector = "collapse-" + key;
            const template = `<div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a data-toggle="collapse" data-parent="#accordion" href="#${selector}">${value.title}</a>
                </h4>
            </div>
            <div id="${selector}" class="panel-collapse collapse in">
            </div>
        </div>`;
            accordion.insertAdjacentHTML('beforeend', template);
            insertLectures(selector, value.id);
        })
    })
        .catch(error => {
            console.error(error.message)
        })
}

function createCourses() {
    client.getUserCoursesAndModules(function (error, data) {
        var idcourse = data.courses[0].id;
        new Promise((resolve, reject) => {
            client.getCourseInfo(idcourse, function (error, data) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(data);
                }
            })
        }).then(data => {
            var langRU = document.getElementById("ru");
            langRU.innerText = data.title_ru;
            var langEng = document.getElementById('eng');
            langEng.innerText = data.title_en;
            var learn = document.getElementById("learn");
            learn.innerText = data.what_you_get_en;
            var learnru = document.getElementById("learnRu");
            learnru.innerText = data.what_you_get_ru;
        }).catch(error => {
            console.error(error.message);
        })
        createAccordion(idcourse);
    });

}

function insertLectures(selector, moduleId) {
    new Promise((resolve, reject) => {
        client.getModuleLectures(moduleId, function (error, data) {
            if (error) {
                return reject(error);
            }
            else {
                return resolve(data);
            }
        })
    }).then(data => {
        var ul = document.createElement('ul');
        data.forEach(function (value) {
            var li = document.createElement('li');
            li.innerText = value.title;
            ul.appendChild(li);
        });
        document.getElementById(selector).appendChild(ul);
    }).catch(error => {
        console.error(error.message);
    });
}


function func() {
    var el = document.getElementById('container1');
    if (el.style.display === 'none') {
        el.style.display = "block";
    }
    else {
        el.style.display = "none";
    }
}
