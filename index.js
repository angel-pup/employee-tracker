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
    let exit = false;

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
            break;
        default:
            exit = true;
    }

    console.clear();
    if(!exit) console.log(cTable.getTable(response[0]));

}

const manage_employees = async () => {
    let response = await inquire(prompts["EMPLOYEE_MANAGE_MENU"])
    let option = response.option;

    let exit = false;
    
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

                let role_id = null;
                
                if (roles) {
                    role_id = await inquire({
                        type: "list",
                        name: "id",
                        message: `Which role will ${first} ${last} have?`,
                        choices: roles,
                        loop: false
                    });
    
                    role_id = role_id.id.split(' ')[0];
                }

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
        default:
            exit = true;
    }

    console.clear();

    if(!exit) console.log(cTable.getTable(response[0]));
}

const view_roles = async () => {
    let response = await connection.promise().query('SELECT * FROM `role`');
    console.clear();
    console.log(cTable.getTable(response[0]));
}


const manage_roles = async () => {
    let response = await inquire(prompts["ROLE_MANAGE_MENU"])
    let option = response.option;
    let exit = false;

    switch(option) {
        case "Add Role":
            {
                response = await connection.promise().query('SELECT * FROM `department`');

                let departments = [];

                response[0].forEach((x) => departments.push(`${x.id}\t ${x.name}`));

                option = await inquire({
                    type: "list",
                    name: "id",
                    message: `Which department will this role be for?\nID:\t DEPARTMENT:`,
                    choices: departments,
                    loop: false
                });

                id = option.id.split(' ')[0]; // grab the id

                option = await inquire({
                    type: "number",
                    name: "amount",
                    message: "How much will this role pay?",
                    default: 100000
                });

                let salary = option.amount;

                option = await inquire({
                    type: "input",
                    name: "title",
                    message: "What is the job title for this role?",
                    default: "Underwater Basket Weaver"
                });

                let title = option.title;

                await connection.promise().query('INSERT INTO `role` (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, id]);

                response = await connection.promise().query('SELECT * FROM role WHERE title = ? AND salary = ? AND department_id = ?', [title, salary, id]);

            }

            break;
        case "Delete Role":
            {
                response = await connection.promise().query('SELECT * FROM `role`');

                let roles = [];

                response[0].forEach((x) => roles.push(`${x.id}\t ${x.title}`));

                option = await inquire({
                    type: "list",
                    name: "id",
                    message: `Which role would you like to delete?\nID:\t DEPARTMENT:`,
                    choices: roles,
                    loop: false
                });

                id = option.id.split(' ')[0]; // grab the id

                await connection.promise().query('DELETE FROM role WHERE id = ?', id);

                response = await connection.promise().query('SELECT * FROM role');

            }
            break;
        default:
            exit = true;
    }

    console.clear();
    if(!exit) console.log(cTable.getTable(response[0]));
}

const view_departments = async () => {
    let response = await connection.promise().query('SELECT * FROM `department`');
    console.clear();
    console.log(cTable.getTable(response[0]));
}

const manage_departments = async () => {
    let response = await inquire(prompts["DEPARTMENT_MANAGE_MENU"]);
    let option = response.option;
    let exit = false;

    switch(option) {
        case "Add Department":
            {
                option = await inquire({
                    type: "input",
                    name: "name",
                    message: `What will be the name of the department?`,
                    default: "The Spoopy Department"
                });

                let name = option.name;

                await connection.promise().query('INSERT INTO department (name) VALUES (?)', name);

                response = await connection.promise().query('SELECT * FROM department');

            }

            break;
        case "Delete Department":
            {
                response = await connection.promise().query('SELECT * FROM `department`');

                let departments = [];

                response[0].forEach((x) => departments.push(`${x.id}\t ${x.name}`));

                option = await inquire({
                    type: "list",
                    name: "id",
                    message: `Which department would you like to delete?\nID:\t DEPARTMENT:`,
                    choices: departments,
                    loop: false
                });

                id = option.id.split(' ')[0]; // grab the id

                await connection.promise().query('DELETE FROM department WHERE id = ?', id);

                response = await connection.promise().query('SELECT * FROM department');
            }
            break;
        default:
            exit = true;
    }

    console.clear();
    if(!exit) console.log(cTable.getTable(response[0]));
}

const view_department_budget = async () => {
    let response = await connection.promise().query('SELECT * FROM `department`');

    let departments = [];

    response[0].forEach((x) => departments.push(`${x.id}\t ${x.name}`));

    option = await inquire({
        type: "list",
        name: "id",
        message: `Which department's budget would you like to see?\nID:\t DEPARTMENT:`,
        choices: departments,
        loop: false
    });

    id = option.id.split(' ')[0]; // grab the id

    response = await connection.promise().query('SELECT SUM(salary) AS TOTAL_BUDGET FROM `departmentEmployees` WHERE department_id = ?', id);
    console.clear();
    console.log(cTable.getTable(response[0]));
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