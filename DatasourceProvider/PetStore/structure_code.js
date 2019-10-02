(function () {
	'use strict';
	log.info('DSP:PetStore - structure - begin');

	out.println('DSP:PetStore - structure');

	var structure = parameters.structure;

	// define the palette of 'types' this model will use
	var attributeNames = [];
	var attributeTypes = [];
	var attributeNullable = [];

	attributeNames.push("id");
	attributeTypes.push(dspFactory.createLong("long"));
	attributeNullable.push(true);

	attributeNames.push("name");
	attributeTypes.push(dspFactory.createString("MyString(50)", 50));
	attributeNullable.push(true);

	dspFactory.createObject("category_obj", attributeNames, attributeTypes, attributeNullable);

	attributeNames = [];
	attributeTypes = [];
	attributeNullable = [];

	attributeNames.push("id");
	attributeTypes.push(dspFactory.createLong("long"));
	attributeNullable.push(true);

	attributeNames.push("name");
	attributeTypes.push(dspFactory.createString("MyString(50)", 50));
	attributeNullable.push(true);

	dspFactory.createObject("tags_obj", attributeNames, attributeTypes, attributeNullable);
	dspFactory.createCollection("tags_coll", "tags_obj", "tags_obj");

	dspFactory.createString('MyString(500)', -1);
	dspFactory.createLong("long");
	dspFactory.createString('MyString(50)', 50);
	dspFactory.createString('MyString(10)', 10);
	dspFactory.createString("date", 30);
	dspFactory.createBoolean("boolean");
	dspFactory.createCollection("photo_coll", "string", "MyString(500)");

	//dspFactory.createCollection("category_coll", "category_obj", "category_obj");
	//status_enum[ "placed", "approved", "delivered" ];
	//metaColumn.getExtendProperty("sortable"); //string, boolean, number, or null
	var petEntity = {
		name: 'Pet',
		columns: [
			{
				name: 'id',
				attrTypeName: dspFactory.asLong(),
				isNullable: false
			}, {
				name: 'category',
				attrTypeName: 'category_obj',
				isNullable: true
			}, {
				name: 'tags',
				attrTypeName: 'tags_coll',
				isNullable: true
			}, {
				name: 'photoUrls',
				attrTypeName: 'photo_coll',
				isNullable: true
			}, {
				name: 'status',
				attrTypeName: 'MyString(10)',
				isNullable: true
			}
		],
		keys: [
			{
				name: 'petId',
				isDatabasePrimary: true,
				columns: ['id']
			}
		]
	};
	structure.tables.add(petEntity);

	var userEntity = {
		name: 'User',
		columns: [
			{
				name: 'id',
				attrTypeName: 'long',
				isNullable: false
			}, {
				name: 'username',
				attrTypeName: 'MyString(50)',
				isNullable: true
			}, {
				name: 'firstname',
				attrTypeName: 'MyString(50)',
				isNullable: true
			}, {
				name: 'lastname',
				attrTypeName: 'MyString(50)',
				isNullable: true
			}, {
				name: 'email',
				attrTypeName: 'MyString(50)',
				isNullable: true
			}, {
				name: 'password',
				attrTypeName: 'MyString(50)',
				isNullable: true
			}, {
				name: 'phone',
				attrTypeName: 'MyString(50)',
				isNullable: true
			}, {
				name: 'userStatus',
				attrTypeName: 'long',
				isNullable: true
			}
		],
		keys: [
			{
				name: 'userId',
				isDatabasePrimary: true,
				columns: ['id']
			}
		]
	}
	structure.tables.add(userEntity);

	var orderEntity = {
		name: 'Order',
		columns: [
			{
				name: 'id',
				attrTypeName: 'long',
				isNullable: false
			}, {
				name: 'petId',
				attrTypeName: 'long',
				isNullable: false
			}, {
				name: 'quantity',
				attrTypeName: 'long',
				isNullable: false
			}, {
				name: 'shipDate',
				attrTypeName: 'date',
				isNullable: false
			}, {
				name: 'status',
				attrTypeName: 'MyString(10)',
				isNullable: false
			}, {
				name: 'complete',
				attrTypeName: 'boolean',
				isNullable: false
			}
		],
		keys: [
			{
				name: 'orderId',
				isDatabasePrimary: true,
				columns: ['id']
			}
		]
	}
	structure.tables.add(orderEntity);

	// add foreign key definition
	//pet to order
	var foreignKey = {
		name: 'Pet_Order',
		updateRule: 'Restrict',
		deleteRule: 'Restrict',
		parent: {
			name: 'Pet'
		}
		, child: {
			name: 'Order'
		}
		, columns: [
			{
				parent: 'id',
				child: 'petId'
			}
		]
	};
	structure.foreignKeys.add(foreignKey);

	dspFactory.createString("string", 20);
	dspFactory.createInteger("int");
	var procedureDefinitions = [
		{
			name: "pet_findByStatus",
			isFunction: false,
			parameters: [
				{
					name: "status",
					attrTypeName: "string",
					argPosition: 1,
					direction: "IN",
					isNullable: false
				}
			],
			remarks: "find a pet by status"
		},
		{
			name: "store_inventory",
			isFunction: false,
			parameters: [],
			remarks: "Returns pet inventories for stores"
		},
		{
			name: "store_order",
			isFunction: false,
			parameters: [
				{
					name: "id",
					attrTypeName: "int",
					argPosition: 1,
					direction: "IN",
					isNullable: false
				},
				{
					name: "petId",
					attrTypeName: "int",
					argPosition: 2,
					direction: "IN",
					isNullable: false
				},
				{
					name: "quantity",
					attrTypeName: "int",
					argPosition: 3,
					direction: "IN",
					isNullable: false
				},
				{
					name: "shipDate",
					attrTypeName: "string",
					argPosition: 4,
					direction: "IN",
					isNullable: false
				},
				{
					name: "status",
					attrTypeName: "string",
					argPosition: 5,
					direction: "IN",
					isNullable: false
				},
				{
					name: "complete",
					attrTypeName: "int",
					argPosition: 6,
					direction: "IN",
					isNullable: false
				}
			],
			remarks: "Place an order for a pet"
		}
	];

	for (var idx in procedureDefinitions) {
		var proc = procedureDefinitions[idx];
		if (!dspFactory.isProcedureRelevant(proc.name)) {
			//filteredProcedures.put(procedureName, true);
			continue;
		}
		structure.procedures.add(proc);
	}

	log.info('DSP:PetStore - structure - end');
})();
