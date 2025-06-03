export class Author {
    constructor({ taxCode, firstName, lastName }) {
        this.taxCode = taxCode;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    toString() {
        return `{
            "taxCode": "${this.taxCode}",
            "firstName": "${this.firstName}",
            "lastName": "${this.lastName}"
        }`;
    }
}
