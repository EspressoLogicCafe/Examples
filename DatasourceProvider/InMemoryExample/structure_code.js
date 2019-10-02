(function () {
	'use strict';
	log.info('DSP:InMemoryExample - structure - begin');

	out.println('DSP:InMemoryExample - structure');

	var structure = parameters.structure;

	// in the future
	// structure = { tables:[], views:[], procedures:[], foreignKeys:[], sequences:[]}

	// define the palette of 'types' this model will use
	dspFactory.createString('MyString(500)', 500);
	dspFactory.createString('MyString(50)', 50);
	dspFactory.createBoolean('Bool');
	dspFactory.createString('PhoneNumber', 20);

	var taskEntity = {
		name: 'Task',
		columns: [
			{
				name: 'Task Description',
				attrTypeName: 'MyString(500)',
				isNullable: false
			}, {
				name: 'Who Completed',
				attrTypeName: 'MyString(50)',
				isNullable: true
			}, {
				name: 'Is Done',
				attrTypeName: 'Bool',
				isNullable: true
			}
		],
		keys: [
			{
				name: 'Unique Task Descriptions',
				isDatabasePrimary: true,
				columns: ['Task Description']
			}
		]
	};

	var personEntity = {
		name: 'Person',
		columns: [
			{
				name: 'Name',
				attrTypeName: 'MyString(50)'
			}, {
				name: 'Number',
				attrTypeName: 'PhoneNumber'
			}],
		keys: [
			{
				name: 'Unique Person Names',
				isDatabasePrimary: true,
				columns: ['Name']
			}
		]
	};

	// future change to structure.tables.push(taskEntity);
	structure.tables.add(taskEntity);
	structure.tables.add(personEntity);

	// add foreign key definition
	var foreignKey = {
		name: 'Task/Person',
		updateRule: 'Restrict',
		deleteRule: 'Restrict',
		parent: {
			name: 'Person'
		}
		, child: {
			name: 'Task'
		}
		, columns: [
			{
				parent: 'Name',
				child: 'Who Completed'
			}
		]
	};
	structure.foreignKeys.add(foreignKey);

	log.info('DSP:InMemoryExample - structure - end');
})();
