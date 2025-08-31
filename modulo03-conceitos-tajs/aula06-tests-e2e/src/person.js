class Person {
  static validade(person) {
    if (!person.name) throw new Error("name is required");
    if (!person.cpf) throw new Error("cpf is required");
  }

  static save(person) {
    if (!["cpf", "name", "lastName"].every((prop) => person[prop])) {
      throw new Error(`cannot save invalid person: ${JSON.stringify(person)}`);
    }

    console.log("registrado com sucesso");
  }

  static process(person) {
    this.validade(person);
    const personFormated = this.format(person);
    this.save(personFormated);
    return personFormated;
  }

  static format(person) {
    const [name, ...lastName] = person.name.split(" ");
    return {
      cpf: person.cpf.replace(/\D/g, ""),
      name,
      lastName: lastName.join(" "),
    };
  }
}

export default Person;
