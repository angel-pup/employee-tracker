const inquirer = require('inquirer');
const prompts = require('./config/prompts');
const connection = require('./config/conn');
const cTable = require('console.table');
const { connect } = require('./config/conn');

const inquire = async (prompt, clear = true) => {
    if (clear) console.clear();

    return inquirer.prompt(prompt)
            .then((data) => data);
}

const view_employees = async () => {
    let response = await inquire(prompts["EMPLOYEE_VIEW_MENU"]);
    let option = response.option;
    let id;

    switch(option) {
        case "View All Employees":
            response = await connection.promise().query('SELECT * FROM employee');
            break;
        case"View Employees by Manager":
            {
                response = await connection.promise().query('SELECT * FROM managers');

                let managers = [];

                response[0].forEach((x) => managers.push(`${x.id}\t ${x.last_name}, ${x.first_name}`));

                option = await inquire({
                    type: "list",
                    name: "id",
                    message: `Which manager's employees would you like to view?\nID:\t LAST, FIRST NAME:`,
                    choices: managers,
                    loop: false
                });

                id = option.id.split(' ')[0]; // grab the id

                response = await connection.promise().query('SELECT * FROM `employee` WHERE `manager_id` = ?', id)
            }

            break;
        case "View Employees by Department":
            {
                response = await connection.promise().query('SELECT * FROM `department`');

                let departments = [];

                response[0].forEach((x) => departments.push(`${x.id}\t ${x.name}`));

                option = await inquire({
                    type: "list",
                    name: "id",
                    message: `Which department's employees would you like to view?\nID:\t DEPARTMENT:`,
                    choices: departments,
                    loop: false
                });

                id = option.id.split(' ')[0]; // grab the id

                response = await connection.promise().query('SELECT * FROM `departmentEmployees` WHERE department_id = ?', id)
            }
    }

    console.clear();
    console.log(cTable.getTable(response[0]));

}

const manage_employees = async () => {
    let response = await inquire(prompts["EMPLOYEE_MANAGE_MENU"])
    let option = response.option;
    
    response = await connection.promise().query('SELECT * FROM `department`');

    let departments = [];

    response[0].forEach((x) => departments.push(`${x.id}\t ${x.name}`));

    switch(option) {
        case "Add Employee":
            {
                let first = await inquire({
                    type: "input",
                    name: "name",
                    message: "What's the employee's first name?",
                    default: "Elijah" // TODO: Add validator
                });

                first = first.name;

                let last = await inquire({
                    type: "input",
                    name: "name",
                    message: "What's the employee's last name?",
                    default: "Wandrschmidt" // TODO: Add validator
                });

                last = last.name;

                let department_id = await inquire({
                    type: "list",
                    name: "id",
                    message: `Which department will ${first} ${last} be in?`,
                    choices: departments,
                    loop: false
                });

                department_id = department_id.id.split(' ')[0];
                
                response = await connection.promise().query('SELECT * FROM `role` WHERE department_id = ?', department_id);

                let roles = [];

                response[0].forEach((x) => roles.push(`${x.id}\t ${x.title}`));

                let role_id = await inquire({
                    type: "list",
                    name: "id",
                    message: `Which role will ${first} ${last} have?`,
                    choices: roles,
                    loop: false
                });

                role_id = role_id.id.split(' ')[0];

                response = await connection.promise().query('SELECT * FROM `departmentEmployees` WHERE department_id = ?', department_id);

                let managers = [];

                response[0].forEach((x) => managers.push(`${x.id}\t ${x.last_name}, ${x.first_name}`));

                let manager_id = await inquire({
                    type: "list",
                    name: "id",
                    message: `Which manager will ${first} ${last} have?`,
                    choices: [...managers, "None"],
                    loop: false
                });

                manager_id = manager_id.id;

                if(manager_id === "None") {
                    manager_id = null;
                } else {
                    manager_id = manager_id.split(' ')[0];
                }

                await connection.promise().query('INSERT INTO `employee` (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [first, last, role_id, manager_id]);
                
                response = await connection.promise().query('SELECT * FROM employee');
            }

            break;
        case "Delete Employee":
            {
                response = await connection.promise().query('SELECT * FROM `employee`');

                let employees = [];

                response[0].forEach((x) => employees.push(`${x.id}\t ${x.last_name}, ${x.first_name}`));

                option = await inquire({
                    type: "list",
                    name: "id",
                    message: `Which employee would you like to delete?\nID:\t LAST, FIRST NAME:`,
                    choices: employees,
                    loop: false
                });

                let id = option.id.split(' ')[0]; // grab the id

                await connection.promise().query('DELETE FROM `employee` WHERE id = ?', id)

                response = await connection.promise().query('SELECT * FROM `employee`');
            }
    
            break;
        case "Update Employee Role":
            {
                response = await connection.promise().query('SELECT * FROM `employee`');
        
                let employees = [];

                response[0].forEach((x) => employees.push(`${x.id}\t ${x.last_name}, ${x.first_name}`));

                option = await inquire({
                    type: "list",
                    name: "id",
                    message: `Which employee would you like to update?\nID:\t LAST, FIRST NAME:`,
                    choices: employees,
                    loop: false
                });

                option = option.id.split(' ');
                id = option[0]; // grab the id
                let first = option[2];
                let last = option[1].slice(0, -1);

                response = await connection.promise().query('SELECT * FROM `role`');

                let roles = [];

                response[0].forEach((x) => roles.push(`${x.id}\t ${x.title}`));

                let role_id = await inquire({
                    type: "list",
                    name: "id",
                    message: `Which role will ${first} ${last} have instead?`,
                    choices: roles,
                    loop: false
                });

                role_id = role_id.id.split(' ')[0];

                await connection.promise().query('UPDATE `employee` SET role_id = ? WHERE id = ?', [role_id, id]);

                response = await connection.promise().query('SELECT * FROM employee WHERE id = ?', id);

            }

            break;
        case "Update Employee Manager":
            {
                response = await connection.promise().query('SELECT * FROM `employee`');
        
                let employees = [];

                response[0].forEach((x) => employees.push(`${x.id}\t ${x.last_name}, ${x.first_name}`));

                option = await inquire({
                    type: "list",
                    name: "id",
                    message: `Which employee would you like to update?\nID:\t LAST, FIRST NAME:`,
                    choices: employees,
                    loop: false
                });

                option = option.id.split(' ');
                let id = option[0]; // grab the id
                let first = option[2];
                let last = option[1].slice(0, -1);

                response = await connection.promise().query('SELECT * FROM `managers`');

                let managers = [];

                response[0].forEach((x) => managers.push(`${x.id}\t ${x.last_name}, ${x.first_name}`));

                let manager_id = await inquire({
                    type: "list",
                    name: "id",
                    message: `Which manager will ${first} ${last} have instead?`,
                    choices: managers,
                    loop: false
                });

                manager_id = manager_id.id.split(' ')[0];

                await connection.promise().query('UPDATE `employee` SET manager_id = ? WHERE id = ?', [manager_id, id]);

                response = await connection.promise().query('SELECT * FROM employee WHERE id = ?', id);

            }
            break;
    }

    console.clear();
    console.log(cTable.getTable(response[0]));
}

const view_roles = async () => {
    let response = await connection.promise().query('SELECT * FROM `role`');
    console.clear();
    console.log(cTable.getTable(response[0]));
}


const manage_roles = async () => {
    const option = await inquire(prompts["ROLE_MANAGE_MENU"]).option

    let exit = false;

    while(!exit) {
        
        switch(option) {
            case "Add Role":
                // INSERT INTO role (id, title, salary, department_id) VALUES (A, B, C, D); // REQUIRES PREQUERY
                break;
            case "Delete Role":
                // DELETE FROM role WHERE id = X; // REQUIRES PREQUERY
                break;
            default:
                exit = true;
        }

    }
}

const view_departments = async () => {
    // SELECT * FROM department;
    // PAUSE!!
}

const manage_departments = async () => {
    const option = await inquire(prompts["DEPARTMENT_MANAGE_MENU"]).option

    while(!exit) {
        
        switch(option) {
            case "Add Department":
                // INSERT INTO department (id, name) VALUES (X, Y); // REQUIRES PREQUERY
                break;
            case "Delete Department":
                // DELETE FROM department WHERE id = X; // REQUIRES PREQUERY
                break;
            default:
                exit = true;
        }

    }
}

const view_department_budget = async () => {
    // SELECT SUM(E.salary) FROM employee E JOIN role R ON R.id = E.role_id JOIN department D ON D.id = R.department_id WHERE D.id = X; // REQUIRES PREQUERY
}

const init = async () => {

    console.clear();

    let exit = false;

    while(!exit) {
        
        const response = await inquire(prompts["MAIN_MENU"], false);

        const option = response.option;

        switch (option) {
            case "View Employees":
                await view_employees();
                break;
            case "Manage Employees":
                await manage_employees();
                break;
            case "View Roles":
                await view_roles();
                break;
            case "Manage Roles":
                await manage_roles();
                break;
            case "View Departments":
                await view_departments();
                break;
            case "Manage Departments":
                await manage_departments();
                break;
            case "View Budget by Department":
                await view_department_budget();
                break;
            case "Quit":
                exit = true;
            default:
                exit = true;
        }

    }

    connection.close();
    console.clear();
}

init();