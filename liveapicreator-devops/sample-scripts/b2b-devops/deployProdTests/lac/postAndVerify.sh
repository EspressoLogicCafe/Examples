#! /bin/bash
# login to 2 different servers (For WAR change to localhost:8080/APIServer)
liveapicreator login -u demo -p Password1 http://localhost:8080/rest/default/b2bderbynw/v1 -a b2b
liveapicreator login -u demo -p Password1 http://localhost:8080/rest/default/b2bderbypavlov/v1 -a pavlov
liveapicreator status

# Show current state
liveapicreator use pavlov
liveapicreator get main:PARTNERORDERS

# switch projects
liveapicreator use b2b

# Post an order to b2b Partner
liveapicreator post PartnerOrder -j '{ "CustomerNumber": "VINET","Items": [ {"ProductNumber": 16, "Quantity": 1 },{"ProductNumber": 7,"Quantity": 2}, {"ProductNumber": 14, "Quantity": 3}, {"ProductNumber": 10, "Quantity": 4}, {"ProductNumber": 13, "Quantity": 5}  ] }'

# Switch Projects and show new partner orders
liveapicreator use pavlov
liveapicreator get main:PARTNERORDERS
lac use b2b
lac get nw:Orders -f 'equal(OrderID: 2000, AmountTotal: 301.20)' --format json
