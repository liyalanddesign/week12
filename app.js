class Person {
  constructor(name, lastName, description) {
    this.name = name;
    this.lastName = lastName;
    this.description = description;
    this.skills = [];
  }

  addSkill(name) {
    this.skills.push(new Skill(name));
  }
}

class Skill {
  constructor(name) {
    this.name = name;
  }
}

// This function is used to generate random persons from API
class PersonService {
  static url = "https://6531d4944d4c2e3f333d4de9.mockapi.io/api/books";
  static getAllPersons() {
    return $.get(this.url);
  }

  static getPerson(id) {
    return $.get(`${this.url}/${id}`);
  }

  // this name lastN and descr took from NOWHERE
  static createPerson(name, lastName, description) {
    return $.post(this.url, name, lastName, description);
  }

  // to watch "_" in url
  static updatePerson(person, name, lastName, description) {
    return $.ajax({
      url: `${this.url}/${person.id}`,
      type: "PUT",
      dataType: "json",
      data: JSON.stringify(person),
      contentType: "application/json",
    });
  }

  static deletePerson(id) {
    return $.ajax({
      url: `${this.url}/${id}`,
      //   method: "DELETE",
      type: "DELETE",
    });
  }
}

class DOMManager {
  static persons;

  static getAllPersons() {
    PersonService.getAllPersons().then((persons) => this.render(persons));
  }

  // Here I create new person / worker
  static createPerson(name, lastName, description) {
    PersonService.createPerson(new Person(name, lastName, description))
      .then(() => PersonService.getAllPersons())
      .then((persons) => this.render(persons));
  }

  static initiateUpdatePerson(id) {
    for (let person of this.persons) {
      if (person.id == id) {
        // Fill inputs with data belongs to user which has to be updated
        $("#name").val(person.name),
          $("#lastName").val(person.lastName),
          $("#description").val(person.description);
        console.log(person);

        $("#updatePerson").on("click", () => {
          person.name = $("#name").val();
          person.lastName = $("#lastName").val();
          person.description = $("#description").val();

          console.log(person);

          PersonService.updatePerson(person)
            .then(() => {
              return PersonService.getAllPersons();
            })
            .then((persons) => this.render(persons));
          $("#name").val(""), $("#lastName").val(""), $("#description").val("");
        });
      }
    }
  }

  static deletePerson(id) {
    PersonService.deletePerson(id)
      .then(() => PersonService.getAllPersons())
      .then((persons) => this.render(persons));
  }

  // static addSkill(id) {
  //   for (let person of this.persons) {
  //     if (person.id == id) {
  //       person.skills.push(new Skill($(`#${person.id}-skill-name`).val()));
  //       PersonService.updatePerson(person)
  //         .then(() => {
  //           return PersonService.getAllPersons();
  //         })
  //         .then((persons) => this.render(persons));
  //     }
  //   }
  // }

  static render(persons) {
    this.persons = persons;
    $("#app").empty();
    for (let person of persons) {
      $("#app").prepend(
        `
        <div class="col-md-6 mb-3 card-wrapper" id="${person.id}">
        <div class="card">
          <span class="badge rounded-pill text-bg-primary">${person.id}</span>
      
          <!-- Card Header -->
          <div class="card-header">
            <div class="row">
              <div class="col-2">
                <img src="${person.avatar}" style="width: 48px; border-radius:50%" />
              </div>
              
              <div class="col-10">
                <h2>${person.name} ${person.lastName}</h2>
              </div>
            </div>
          </div>
          <!-- End of card header  -->
      
          <!-- Card Body -->
          <div class="card-body"> 
            <div class="row visible">
              <p>${person.description}</p>
            </div>
            
            <div class="hidden">
              <button class="btn btn-danger" onclick="DOMManager.deletePerson('${person.id}')">Delete Card</button>
            </div>
            

          </div>
      
        </div>
      </div><br>
        `
      );
      // for (let skill of person.skills) {
      //   // console.log(person);
      //   $(`#${person.id}`).find(".card-body").append(`
      //   <p>
      //     <span id="name-${skill.id}"><strong>Skill:</strong>  ${skill.name}</span>
      //     <button class="btn btn-warning form-control" onclick="DOMManager.deleteSkill('${person.id}', '${skill.id}' )">Delete skill</button>
      //   </p>
      //   `);
      // }
    }
  }
}

$("#addPerson").on("click", function () {
  DOMManager.createPerson(
    $("#name").val(),
    $("#lastName").val(),
    $("#description").val()
  );
  $("#name").val(""), $("#lastName").val(""), $("#description").val("");
});

DOMManager.getAllPersons();
