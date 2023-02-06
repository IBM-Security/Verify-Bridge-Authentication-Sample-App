// 
// Copyright contributors to the IBM Security Verify Bridge for Authentication Sample App project
// 

data_source = {
    scott: {
        id: 1,
        password: "scott11111",
        displayName: "Scott",
        givenName: "Scott",
        SN: "Admin",
        emailAddress: "scott@fake-email.com",
        cn: "Scott Admin",
        employee_number: "AG38US",
        mobile_number: "111-222-3333",
        accountLocked: false,
        passwordExpired: false,
        groups: [
            {
                'name': 'developer',
                'id': '608000GTNH'
            }, 
            {
                'name': 'admin',
                'id': '608000GTNF'
            }
        ]
    },
    alice: {
        id: 2,
        password: "alice11111",
        displayName: "Alice",
        givenName: "Alice",
        SN: "Developer",
        emailAddress: "alice@fake-email.com",
        cn: "Alice Developer",
        employee_number: "CS22US",
        mobile_number: "555-555-5555",
        accountLocked: false,
        passwordExpired: false,
        groups: [
            {
                'name': 'developer',
                'id': '608000GTNH'
            }
        ]
    },
    jessica: {
        id: 3,
        password: "jessica11111",
        displayName: "Jess",
        givenName: "Jessica",
        SN: "User",
        emailAddress: "alice@fake-email.com",
        cn: "Jessica User",
        employee_number: "MA86US",
        mobile_number: "555-555-5555",
        accountLocked: false,
        passwordExpired: false,
        groups: []
    },
    jon: {
        id: 4,
        password: "jon11111",
        displayName: "JohnU",
        givenName: "John",
        SN: "User",
        emailAddress: "jon@fake-email.com",
        cn: "John User",
        employee_number: "AB54AU",
        mobile_number: "222-333-4444",
        accountLocked: false,
        passwordExpired: true,
        groups: []

    },
    bon: {
        id: 5,
        password: "bon11111",
        displayName: "BonnieU",
        givenName: "Bonnie",
        SN: "User",
        emailAddress: "bon@fake-email.com",
        cn: "Bonnie User",
        employee_number: "AD24UK",
        mobile_number: "333-444-5555",
        accountLocked: true,
        passwordExpired: false,
        groups: []
    }
}

module.exports = data_source;