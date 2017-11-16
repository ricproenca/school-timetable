import TeachersXMLFile from '../fet/inputs/teachers.xml';
import Parser from './js/helpers/xmlParser';

console.log('*** SCHOOL TIMETABLE *** ');

var jsonTeachers = Parser.parseXmlTeachers(TeachersXMLFile);
console.log(jsonTeachers);
