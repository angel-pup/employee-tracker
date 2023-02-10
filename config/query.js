const connection = require('./config/conn');

// simple query
const simple = () => {
    connection.query(
    //   'SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45',
    //   function(err, results, fields) {
    //     console.log(results); // results contains rows returned by server
    //     console.log(fields); // fields contains extra meta data about results, if available
    //   }
    );
}

// with placeholder
const placeholder = () => {
    connection.query(
    //   'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
    //   ['Page', 45],
    //   function(err, results) {
    //     console.log(results);
    //   }
    );
}

const add_employee = () => {
    // TODO
}

const del_employee = (id) => {
    // TODO
}

const update_employee = () => {
    // TODO
}

const add_department = () => {
    // TODO
}

const del_department = (id) => {
    // TODO
}

const update_department = () => {
    // TODO
}

const add_role = () => {
    // TODO
}

const del_role = (id) => {
    // TODO
}

const update_role = () => {
    // TODO
}