# WebEnviorments3.2RestAPI
#####this repository is for assignment 3.2 in BGU's Web Environments course at the SISE department of engineering.
###this is a NodeJs REST API , supports the application described in the assignment instructions.
all responses with data will return that data in a JSON format. 
the following methods are supported:

####Login:
*URL*:'/login/{params}'
*Params*: String :username, String: password.   
*returns* : Token.   
*Description*: returns -1 if failed.


####GetRandomPOI:
*URL*:'/poi/{params}'
*Params*: int: id, String: password.   
*returns* : Token.   
*Description*: returns -1 if failed.