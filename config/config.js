const config = {
    local:{
        DB:{
            HOST:"",
            DB_PORT:27017,
            DB_NAME: "ECOMMERCEAPP"
        },
        API_PORT : 8080
    },

    prod:{
        DB:{
            HOST: "",
            DB_PORT: 27017,
            DB_NAME:"ECOMMERCEAPP",
        },
        API_PORT : 8080
    },

    testing:{
        DB:{
            HOST: " ",
            DB_PORT: 27017,
            DB_NAME: "ECOMMERCEAPP"
        },
        API_PORT : 8080
    },
};

export default config;