const prompts = {
    "MAIN_MENU" : {
        type: "list",
        name: "option",
        message: "What would you like to do?",
        choices: [
            "View Employees", // Can probably further separate menus by type
            "Manage Employees",
            "View Roles",
            "Manage Roles",
            "View Departments",
            "Manage Departments",
            "View Budget by Department", // by role, too?
            "Quit",
        ],
        loop: false
    },
    "EMPLOYEE_VIEW_MENU" : {
        type: "list",
        name: "option",
        message: "VIEW EMPLOYEES: Which employees would you like to see?",
        choices: [
            "View All Employees",
            "View Employees by Manager",
            "View Employees by Department",
            // "View Employees by Role",
            // "View Employees by Salary Range",
            "Go Back"
        ],
        loop: false
    },
    "EMPLOYEE_MANAGE_MENU" : {
        type: "list",
        name: "option",
        message: "MANAGE EMPLOYEES: What would you like to do?",
        choices: [
            "Add Employee",
            "Delete Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "Back",
        ],
        loop: false
    },
    "ROLE_MANAGE_MENU" : {
        type: "list",
        name: "option",
        message: "MANAGE ROLES: What would you like to do?",
        choices: [
            "Add Role",
            "Delete Role",
            // "Change Salary",
            // "Change Title",
            // "Change Department",
            "Go Back"
        ],
        loop: false
    },
    "DEPARTMENT_MANAGE_MENU" :  {
        type: "list",
        name: "option",
        message: "MANAGE DEPARTMENTS: What would you like to do?",
        choices: [
            "Add Department",
            "Delete Department"
        ],
        loop: false
    }
};

module.exports = prompts;