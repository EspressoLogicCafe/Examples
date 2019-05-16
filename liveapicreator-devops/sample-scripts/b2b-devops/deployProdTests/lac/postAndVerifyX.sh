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

liveapicreator get testB2BAll

# liveapicreator post PartnerOrder -j '{"CustomerNumber": "VINET","Items": [{"Product": {"@metadata": {"action": "LOOKUP","key": "ProductName"},"ProductName": "Pavlova"},"Quantity": 1},{"Product": {"@metadata": {"action": "LOOKUP","key": "ProductName"},"ProductName": "Uncle Bob''s Organic Dried Pears"},"Quantity": 2},{"Product": {"@metadata": {"action": "LOOKUP","key": "ProductName"},"ProductName": "Tofu"},"Quantity": 3},{"Product": {"@metadata": {"action": "LOOKUP","key": "ProductName"},"ProductName": "Ikura"},"Quantity": 4},{"Product": {"@metadata": {"action": "LOOKUP","key": "ProductName"},"ProductName": "Konbu"},"Quantity": 5},{"Product": {"@metadata": {"action": "LOOKUP","key": "ProductName"},"ProductName": "Alice Mutton"},"Quantity": 1}],"Shipper": {"@metadata": {"action": "LOOKUP","key": "CompanyName"},"CompanyName": "Federal Shipping"}}'

# Switch Projects and show new partner orders
liveapicreator use pavlov
liveapicreator get main:PARTNERORDERS
lac use b2b
lac get nw:Orders -f 'equal(OrderID: 2000, AmountTotal: 301.20)' --format json
