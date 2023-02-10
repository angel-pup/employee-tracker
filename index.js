const inquirer = require('inquirer');
const prompts = require('./config/prompts');
const query = require('./config/query');

const inquire = async (prompt) => {
    return inquirer.prompt(prompt)
            .then((data) => data);
}

const view_employees = async () => {
    const option = await inquire(prompts["EMPLOYEE_VIEW_MENU"]).option;

    let exit = false;

    while(!exit) {

        switch(option) {
            case "View All Employees":
                // SELECT * FROM employee;
                break;
            case"View Employees by Manager":
                // SELECT * FROM employee WHERE manager_id = X; // REQUIRES PREQUERY
                break;
            case "View Employees by Department":
                // SELECT * FROM employee E JOIN role R ON R.id = E.role_id JOIN DEPARTMENT D ON D.id = R.department_id WHERE D.id = X; // REQUIRES PREQUERY
                break;
            default:
                exit = true;
        }

    }

}

const manage_employees = async () => {
    const option = await inquire(prompts["EMPLOYEE_MANAGE_MENU"]).option

    let exit = false;

    while(!exit) {

        switch(option) {
            case "Add Employee":
                // INSERT INTO employee (id, first_name_ last_name, role_id, manager_id) VALUES (A, B, C, X, Y); // REQUIRES PREQUERY
                break;
            case "Delete Employee":
                // DELETE FROM employee WHERE id = X; // REQUIRES PREQUERY
                break;
            case "Update Employee Role":
                // UPDATE employee SET role_id = new_id WHERE id = X; // REQUIRES PREQUERY
                break;
            case "Update Employee Manager":
                // UPDATE employee SET manager_id = new_id WHERE id = X; // REQUIRES PREQUERY
                break;
            default:
                exit = true;
        }

    }
}

const view_roles = async () => {
    // SELECT * FROM role;
    // PAUSE!!
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
    // SELECT SUM(salary) FROM employee E JOIN role R ON R.id = E.role_id JOIN department D ON D.id = R.department_id WHERE D.id = X; // REQUIRES PREQUERY
}

const init = async () => {

    let exit = false;

    while(!exit) {

        switch (await inquire(prompts["MAIN_MENU"]).option) {
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
            default:
                exit = true;
        }

    }

}

init();