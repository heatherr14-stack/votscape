import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { colors } from '../utils/colors';
import { useAccessibility } from '../contexts/AccessibilityContext';

// US States data
const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

// State officials data
const STATE_OFFICIALS = {
  'AL': {
    governor: { name: 'Kay Ivey', party: 'Republican' },
    lieutenantGovernor: { name: 'Will Ainsworth', party: 'Republican' },
    secretaryOfState: { name: 'Wes Allen', party: 'Republican' },
    attorneyGeneral: { name: 'Steve Marshall', party: 'Republican' },
    representatives: [
      { name: 'Jerry Carl', party: 'Republican', district: '1st' },
      { name: 'Barry Moore', party: 'Republican', district: '2nd' },
      { name: 'Mike Rogers', party: 'Republican', district: '3rd' },
      { name: 'Robert Aderholt', party: 'Republican', district: '4th' },
      { name: 'Dale Strong', party: 'Republican', district: '5th' },
      { name: 'Gary Palmer', party: 'Republican', district: '6th' },
      { name: 'Terri Sewell', party: 'Democratic', district: '7th' },
    ]
  },
  'AK': {
    governor: { name: 'Mike Dunleavy', party: 'Republican' },
    lieutenantGovernor: { name: 'Kevin Meyer', party: 'Republican' },
    secretaryOfState: { name: 'N/A', party: 'N/A' }, // Alaska doesn't have this position
    attorneyGeneral: { name: 'Treg Taylor', party: 'Republican' },
    representatives: [
      { name: 'Mary Peltola', party: 'Democratic', district: 'At-Large' },
    ]
  },
  'AZ': {
    governor: { name: 'Katie Hobbs', party: 'Democratic' },
    lieutenantGovernor: { name: 'N/A', party: 'N/A' }, // Arizona doesn't have this position
    secretaryOfState: { name: 'Adrian Fontes', party: 'Democratic' },
    attorneyGeneral: { name: 'Kris Mayes', party: 'Democratic' },
    representatives: [
      { name: 'David Schweikert', party: 'Republican', district: '1st' },
      { name: 'Eli Crane', party: 'Republican', district: '2nd' },
      { name: 'Ruben Gallego', party: 'Democratic', district: '3rd' },
      { name: 'Greg Stanton', party: 'Democratic', district: '4th' },
      { name: 'Andy Biggs', party: 'Republican', district: '5th' },
      { name: 'Juan Ciscomani', party: 'Republican', district: '6th' },
      { name: 'Raúl Grijalva', party: 'Democratic', district: '7th' },
      { name: 'Debbie Lesko', party: 'Republican', district: '8th' },
      { name: 'Paul Gosar', party: 'Republican', district: '9th' },
    ]
  },
  'AR': {
    governor: { name: 'Sarah Huckabee Sanders', party: 'Republican' },
    lieutenantGovernor: { name: 'Leslie Rutledge', party: 'Republican' },
    secretaryOfState: { name: 'John Thurston', party: 'Republican' },
    attorneyGeneral: { name: 'Tim Griffin', party: 'Republican' },
    representatives: [
      { name: 'Rick Crawford', party: 'Republican', district: '1st' },
      { name: 'French Hill', party: 'Republican', district: '2nd' },
      { name: 'Steve Womack', party: 'Republican', district: '3rd' },
      { name: 'Bruce Westerman', party: 'Republican', district: '4th' },
    ]
  },
  'CA': {
    governor: { name: 'Gavin Newsom', party: 'Democratic' },
    lieutenantGovernor: { name: 'Eleni Kounalakis', party: 'Democratic' },
    secretaryOfState: { name: 'Shirley Weber', party: 'Democratic' },
    attorneyGeneral: { name: 'Rob Bonta', party: 'Democratic' },
    representatives: [
      { name: 'Doug LaMalfa', party: 'Republican', district: '1st' },
      { name: 'Jared Huffman', party: 'Democratic', district: '2nd' },
      { name: 'Kevin Kiley', party: 'Republican', district: '3rd' },
      { name: 'Tom McClintock', party: 'Republican', district: '4th' },
      { name: 'Mike Thompson', party: 'Democratic', district: '5th' },
      { name: 'Ami Bera', party: 'Democratic', district: '6th' },
      { name: 'Doris Matsui', party: 'Democratic', district: '7th' },
      { name: 'John Garamendi', party: 'Democratic', district: '8th' },
      { name: 'Josh Harder', party: 'Democratic', district: '9th' },
      { name: 'Mark DeSaulnier', party: 'Democratic', district: '10th' },
      { name: 'Nancy Pelosi', party: 'Democratic', district: '11th' },
      { name: 'Barbara Lee', party: 'Democratic', district: '12th' },
      { name: 'John Duarte', party: 'Republican', district: '13th' },
      { name: 'Eric Swalwell', party: 'Democratic', district: '14th' },
      { name: 'Kevin Mullin', party: 'Democratic', district: '15th' },
      { name: 'Anna Eshoo', party: 'Democratic', district: '16th' },
      { name: 'Ro Khanna', party: 'Democratic', district: '17th' },
      { name: 'Zoe Lofgren', party: 'Democratic', district: '18th' },
      { name: 'Jimmy Panetta', party: 'Democratic', district: '19th' },
      { name: 'Kevin McCarthy', party: 'Republican', district: '20th' },
    ]
  },
  'CO': {
    governor: { name: 'Jared Polis', party: 'Democratic' },
    lieutenantGovernor: { name: 'Dianne Primavera', party: 'Democratic' },
    secretaryOfState: { name: 'Jena Griswold', party: 'Democratic' },
    attorneyGeneral: { name: 'Phil Weiser', party: 'Democratic' },
    representatives: [
      { name: 'Diana DeGette', party: 'Democratic', district: '1st' },
      { name: 'Joe Neguse', party: 'Democratic', district: '2nd' },
      { name: 'Lauren Boebert', party: 'Republican', district: '3rd' },
      { name: 'Ken Buck', party: 'Republican', district: '4th' },
      { name: 'Doug Lamborn', party: 'Republican', district: '5th' },
      { name: 'Jason Crow', party: 'Democratic', district: '6th' },
      { name: 'Brittany Pettersen', party: 'Democratic', district: '7th' },
      { name: 'Yadira Caraveo', party: 'Democratic', district: '8th' },
    ]
  },
  'CT': {
    governor: { name: 'Ned Lamont', party: 'Democratic' },
    lieutenantGovernor: { name: 'Susan Bysiewicz', party: 'Democratic' },
    secretaryOfState: { name: 'Stephanie Thomas', party: 'Democratic' },
    attorneyGeneral: { name: 'William Tong', party: 'Democratic' },
    representatives: [
      { name: 'John Larson', party: 'Democratic', district: '1st' },
      { name: 'Joe Courtney', party: 'Democratic', district: '2nd' },
      { name: 'Rosa DeLauro', party: 'Democratic', district: '3rd' },
      { name: 'Jim Himes', party: 'Democratic', district: '4th' },
      { name: 'Jahana Hayes', party: 'Democratic', district: '5th' },
    ]
  },
  'DE': {
    governor: { name: 'John Carney', party: 'Democratic' },
    lieutenantGovernor: { name: 'Bethany Hall-Long', party: 'Democratic' },
    secretaryOfState: { name: 'Jeffrey Bullock', party: 'Democratic' },
    attorneyGeneral: { name: 'Kathleen Jennings', party: 'Democratic' },
    representatives: [
      { name: 'Lisa Blunt Rochester', party: 'Democratic', district: 'At-Large' },
    ]
  },
  'FL': {
    governor: { name: 'Ron DeSantis', party: 'Republican' },
    lieutenantGovernor: { name: 'Jeanette Nuñez', party: 'Republican' },
    secretaryOfState: { name: 'Cord Byrd', party: 'Republican' },
    attorneyGeneral: { name: 'Ashley Moody', party: 'Republican' },
    representatives: [
      { name: 'Matt Gaetz', party: 'Republican', district: '1st' },
      { name: 'Neal Dunn', party: 'Republican', district: '2nd' },
      { name: 'Kat Cammack', party: 'Republican', district: '3rd' },
      { name: 'Aaron Bean', party: 'Republican', district: '4th' },
      { name: 'John Rutherford', party: 'Republican', district: '5th' },
      { name: 'Michael Waltz', party: 'Republican', district: '6th' },
      { name: 'Cory Mills', party: 'Republican', district: '7th' },
      { name: 'Bill Posey', party: 'Republican', district: '8th' },
      { name: 'Darren Soto', party: 'Democratic', district: '9th' },
      { name: 'Val Demings', party: 'Democratic', district: '10th' },
      { name: 'Daniel Webster', party: 'Republican', district: '11th' },
      { name: 'Gus Bilirakis', party: 'Republican', district: '12th' },
      { name: 'Anna Paulina Luna', party: 'Republican', district: '13th' },
      { name: 'Kathy Castor', party: 'Democratic', district: '14th' },
      { name: 'Laurel Lee', party: 'Republican', district: '15th' },
      { name: 'Vern Buchanan', party: 'Republican', district: '16th' },
      { name: 'Greg Steube', party: 'Republican', district: '17th' },
      { name: 'Scott Franklin', party: 'Republican', district: '18th' },
      { name: 'Byron Donalds', party: 'Republican', district: '19th' },
      { name: 'Sheila Cherfilus-McCormick', party: 'Democratic', district: '20th' },
      { name: 'Lois Frankel', party: 'Democratic', district: '21st' },
      { name: 'Jared Moskowitz', party: 'Democratic', district: '23rd' },
      { name: 'Frederica Wilson', party: 'Democratic', district: '24th' },
      { name: 'Mario Diaz-Balart', party: 'Republican', district: '25th' },
      { name: 'Carlos Gimenez', party: 'Republican', district: '26th' },
      { name: 'Maria Elvira Salazar', party: 'Republican', district: '27th' },
      { name: 'Debbie Wasserman Schultz', party: 'Democratic', district: '28th' },
    ]
  },
  'GA': {
    governor: { name: 'Brian Kemp', party: 'Republican' },
    lieutenantGovernor: { name: 'Burt Jones', party: 'Republican' },
    secretaryOfState: { name: 'Brad Raffensperger', party: 'Republican' },
    attorneyGeneral: { name: 'Chris Carr', party: 'Republican' },
    representatives: [
      { name: 'Buddy Carter', party: 'Republican', district: '1st' },
      { name: 'Sanford Bishop', party: 'Democratic', district: '2nd' },
      { name: 'Drew Ferguson', party: 'Republican', district: '3rd' },
      { name: 'Hank Johnson', party: 'Democratic', district: '4th' },
      { name: 'Nikema Williams', party: 'Democratic', district: '5th' },
      { name: 'Rich McCormick', party: 'Republican', district: '6th' },
      { name: 'Lucy McBath', party: 'Democratic', district: '7th' },
      { name: 'Austin Scott', party: 'Republican', district: '8th' },
      { name: 'Andrew Clyde', party: 'Republican', district: '9th' },
      { name: 'Mike Collins', party: 'Republican', district: '10th' },
      { name: 'Barry Loudermilk', party: 'Republican', district: '11th' },
      { name: 'Rick Allen', party: 'Republican', district: '12th' },
      { name: 'David Scott', party: 'Democratic', district: '13th' },
      { name: 'Marjorie Taylor Greene', party: 'Republican', district: '14th' },
    ]
  },
  'HI': {
    governor: { name: 'Josh Green', party: 'Democratic' },
    lieutenantGovernor: { name: 'Sylvia Luke', party: 'Democratic' },
    secretaryOfState: { name: 'N/A', party: 'N/A' }, // Hawaii doesn't have this position
    attorneyGeneral: { name: 'Anne Lopez', party: 'Democratic' },
    representatives: [
      { name: 'Ed Case', party: 'Democratic', district: '1st' },
      { name: 'Jill Tokuda', party: 'Democratic', district: '2nd' },
    ]
  },
  'ID': {
    governor: { name: 'Brad Little', party: 'Republican' },
    lieutenantGovernor: { name: 'Scott Bedke', party: 'Republican' },
    secretaryOfState: { name: 'Phil McGrane', party: 'Republican' },
    attorneyGeneral: { name: 'Raúl Labrador', party: 'Republican' },
    representatives: [
      { name: 'Russ Fulcher', party: 'Republican', district: '1st' },
      { name: 'Mike Simpson', party: 'Republican', district: '2nd' },
    ]
  },
  'IL': {
    governor: { name: 'J.B. Pritzker', party: 'Democratic' },
    lieutenantGovernor: { name: 'Juliana Stratton', party: 'Democratic' },
    secretaryOfState: { name: 'Alexi Giannoulias', party: 'Democratic' },
    attorneyGeneral: { name: 'Kwame Raoul', party: 'Democratic' },
    representatives: [
      { name: 'Jonathan Jackson', party: 'Democratic', district: '1st' },
      { name: 'Robin Kelly', party: 'Democratic', district: '2nd' },
      { name: 'Delia Ramirez', party: 'Democratic', district: '3rd' },
      { name: 'Jesús García', party: 'Democratic', district: '4th' },
      { name: 'Mike Quigley', party: 'Democratic', district: '5th' },
      { name: 'Sean Casten', party: 'Democratic', district: '6th' },
      { name: 'Danny Davis', party: 'Democratic', district: '7th' },
      { name: 'Raja Krishnamoorthi', party: 'Democratic', district: '8th' },
      { name: 'Jan Schakowsky', party: 'Democratic', district: '9th' },
      { name: 'Brad Schneider', party: 'Democratic', district: '10th' },
      { name: 'Bill Foster', party: 'Democratic', district: '11th' },
      { name: 'Mike Bost', party: 'Republican', district: '12th' },
      { name: 'Nikki Budzinski', party: 'Democratic', district: '13th' },
      { name: 'Lauren Underwood', party: 'Democratic', district: '14th' },
      { name: 'Mary Miller', party: 'Republican', district: '15th' },
      { name: 'Darin LaHood', party: 'Republican', district: '16th' },
      { name: 'Eric Sorensen', party: 'Democratic', district: '17th' },
    ]
  },
  'IN': {
    governor: { name: 'Eric Holcomb', party: 'Republican' },
    lieutenantGovernor: { name: 'Suzanne Crouch', party: 'Republican' },
    secretaryOfState: { name: 'Diego Morales', party: 'Republican' },
    attorneyGeneral: { name: 'Todd Rokita', party: 'Republican' },
    representatives: [
      { name: 'Frank Mrvan', party: 'Democratic', district: '1st' },
      { name: 'Rudy Yakym', party: 'Republican', district: '2nd' },
      { name: 'Jim Banks', party: 'Republican', district: '3rd' },
      { name: 'Jim Baird', party: 'Republican', district: '4th' },
      { name: 'Victoria Spartz', party: 'Republican', district: '5th' },
      { name: 'Greg Pence', party: 'Republican', district: '6th' },
      { name: 'André Carson', party: 'Democratic', district: '7th' },
      { name: 'Larry Bucshon', party: 'Republican', district: '8th' },
      { name: 'Erin Houchin', party: 'Republican', district: '9th' },
    ]
  },
  'IA': {
    governor: { name: 'Kim Reynolds', party: 'Republican' },
    lieutenantGovernor: { name: 'Adam Gregg', party: 'Republican' },
    secretaryOfState: { name: 'Paul Pate', party: 'Republican' },
    attorneyGeneral: { name: 'Brenna Bird', party: 'Republican' },
    representatives: [
      { name: 'Mariannette Miller-Meeks', party: 'Republican', district: '1st' },
      { name: 'Ashley Hinson', party: 'Republican', district: '2nd' },
      { name: 'Zach Nunn', party: 'Republican', district: '3rd' },
      { name: 'Randy Feenstra', party: 'Republican', district: '4th' },
    ]
  },
  'KS': {
    governor: { name: 'Laura Kelly', party: 'Democratic' },
    lieutenantGovernor: { name: 'David Toland', party: 'Democratic' },
    secretaryOfState: { name: 'Scott Schwab', party: 'Republican' },
    attorneyGeneral: { name: 'Kris Kobach', party: 'Republican' },
    representatives: [
      { name: 'Tracey Mann', party: 'Republican', district: '1st' },
      { name: 'Jake LaTurner', party: 'Republican', district: '2nd' },
      { name: 'Sharice Davids', party: 'Democratic', district: '3rd' },
      { name: 'Ron Estes', party: 'Republican', district: '4th' },
    ]
  },
  'KY': {
    governor: { name: 'Andy Beshear', party: 'Democratic' },
    lieutenantGovernor: { name: 'Jacqueline Coleman', party: 'Democratic' },
    secretaryOfState: { name: 'Michael Adams', party: 'Republican' },
    attorneyGeneral: { name: 'Russell Coleman', party: 'Republican' },
    representatives: [
      { name: 'James Comer', party: 'Republican', district: '1st' },
      { name: 'Brett Guthrie', party: 'Republican', district: '2nd' },
      { name: 'Morgan McGarvey', party: 'Democratic', district: '3rd' },
      { name: 'Thomas Massie', party: 'Republican', district: '4th' },
      { name: 'Hal Rogers', party: 'Republican', district: '5th' },
      { name: 'Andy Barr', party: 'Republican', district: '6th' },
    ]
  },
  'LA': {
    governor: { name: 'Jeff Landry', party: 'Republican' },
    lieutenantGovernor: { name: 'Billy Nungesser', party: 'Republican' },
    secretaryOfState: { name: 'Nancy Landry', party: 'Republican' },
    attorneyGeneral: { name: 'Liz Murrill', party: 'Republican' },
    representatives: [
      { name: 'Steve Scalise', party: 'Republican', district: '1st' },
      { name: 'Troy Carter', party: 'Democratic', district: '2nd' },
      { name: 'Clay Higgins', party: 'Republican', district: '3rd' },
      { name: 'Mike Johnson', party: 'Republican', district: '4th' },
      { name: 'Julia Letlow', party: 'Republican', district: '5th' },
      { name: 'Garret Graves', party: 'Republican', district: '6th' },
    ]
  },
  'ME': {
    governor: { name: 'Janet Mills', party: 'Democratic' },
    lieutenantGovernor: { name: 'N/A', party: 'N/A' }, // Maine doesn't have this position
    secretaryOfState: { name: 'Shenna Bellows', party: 'Democratic' },
    attorneyGeneral: { name: 'Aaron Frey', party: 'Democratic' },
    representatives: [
      { name: 'Chellie Pingree', party: 'Democratic', district: '1st' },
      { name: 'Jared Golden', party: 'Democratic', district: '2nd' },
    ]
  },
  'MD': {
    governor: { name: 'Wes Moore', party: 'Democratic' },
    lieutenantGovernor: { name: 'Aruna Miller', party: 'Democratic' },
    secretaryOfState: { name: 'Susan Lee', party: 'Democratic' },
    attorneyGeneral: { name: 'Anthony Brown', party: 'Democratic' },
    representatives: [
      { name: 'Andy Harris', party: 'Republican', district: '1st' },
      { name: 'Dutch Ruppersberger', party: 'Democratic', district: '2nd' },
      { name: 'John Sarbanes', party: 'Democratic', district: '3rd' },
      { name: 'Glenn Ivey', party: 'Democratic', district: '4th' },
      { name: 'Steny Hoyer', party: 'Democratic', district: '5th' },
      { name: 'David Trone', party: 'Democratic', district: '6th' },
      { name: 'Kweisi Mfume', party: 'Democratic', district: '7th' },
      { name: 'Jamie Raskin', party: 'Democratic', district: '8th' },
    ]
  },
  'MA': {
    governor: { name: 'Maura Healey', party: 'Democratic' },
    lieutenantGovernor: { name: 'Kim Driscoll', party: 'Democratic' },
    secretaryOfState: { name: 'William Galvin', party: 'Democratic' },
    attorneyGeneral: { name: 'Andrea Campbell', party: 'Democratic' },
    representatives: [
      { name: 'Richard Neal', party: 'Democratic', district: '1st' },
      { name: 'Jim McGovern', party: 'Democratic', district: '2nd' },
      { name: 'Lori Trahan', party: 'Democratic', district: '3rd' },
      { name: 'Jake Auchincloss', party: 'Democratic', district: '4th' },
      { name: 'Katherine Clark', party: 'Democratic', district: '5th' },
      { name: 'Seth Moulton', party: 'Democratic', district: '6th' },
      { name: 'Ayanna Pressley', party: 'Democratic', district: '7th' },
      { name: 'Stephen Lynch', party: 'Democratic', district: '8th' },
      { name: 'Bill Keating', party: 'Democratic', district: '9th' },
    ]
  },
  'MI': {
    governor: { name: 'Gretchen Whitmer', party: 'Democratic' },
    lieutenantGovernor: { name: 'Garlin Gilchrist II', party: 'Democratic' },
    secretaryOfState: { name: 'Jocelyn Benson', party: 'Democratic' },
    attorneyGeneral: { name: 'Dana Nessel', party: 'Democratic' },
    representatives: [
      { name: 'Jack Bergman', party: 'Republican', district: '1st' },
      { name: 'John Moolenaar', party: 'Republican', district: '2nd' },
      { name: 'Hillary Scholten', party: 'Democratic', district: '3rd' },
      { name: 'Bill Huizenga', party: 'Republican', district: '4th' },
      { name: 'Tim Walberg', party: 'Republican', district: '5th' },
      { name: 'Debbie Dingell', party: 'Democratic', district: '6th' },
      { name: 'Elissa Slotkin', party: 'Democratic', district: '7th' },
      { name: 'Dan Kildee', party: 'Democratic', district: '8th' },
      { name: 'Lisa McClain', party: 'Republican', district: '9th' },
      { name: 'John James', party: 'Republican', district: '10th' },
      { name: 'Haley Stevens', party: 'Democratic', district: '11th' },
      { name: 'Rashida Tlaib', party: 'Democratic', district: '12th' },
      { name: 'Shri Thanedar', party: 'Democratic', district: '13th' },
    ]
  },
  'MN': {
    governor: { name: 'Tim Walz', party: 'Democratic' },
    lieutenantGovernor: { name: 'Peggy Flanagan', party: 'Democratic' },
    secretaryOfState: { name: 'Steve Simon', party: 'Democratic' },
    attorneyGeneral: { name: 'Keith Ellison', party: 'Democratic' },
    representatives: [
      { name: 'Brad Finstad', party: 'Republican', district: '1st' },
      { name: 'Angie Craig', party: 'Democratic', district: '2nd' },
      { name: 'Dean Phillips', party: 'Democratic', district: '3rd' },
      { name: 'Betty McCollum', party: 'Democratic', district: '4th' },
      { name: 'Ilhan Omar', party: 'Democratic', district: '5th' },
      { name: 'Tom Emmer', party: 'Republican', district: '6th' },
      { name: 'Michelle Fischbach', party: 'Republican', district: '7th' },
      { name: 'Pete Stauber', party: 'Republican', district: '8th' },
    ]
  },
  'MS': {
    governor: { name: 'Tate Reeves', party: 'Republican' },
    lieutenantGovernor: { name: 'Delbert Hosemann', party: 'Republican' },
    secretaryOfState: { name: 'Michael Watson', party: 'Republican' },
    attorneyGeneral: { name: 'Lynn Fitch', party: 'Republican' },
    representatives: [
      { name: 'Trent Kelly', party: 'Republican', district: '1st' },
      { name: 'Bennie Thompson', party: 'Democratic', district: '2nd' },
      { name: 'Michael Guest', party: 'Republican', district: '3rd' },
      { name: 'Mike Ezell', party: 'Republican', district: '4th' },
    ]
  },
  'MO': {
    governor: { name: 'Mike Parson', party: 'Republican' },
    lieutenantGovernor: { name: 'Mike Kehoe', party: 'Republican' },
    secretaryOfState: { name: 'Jay Ashcroft', party: 'Republican' },
    attorneyGeneral: { name: 'Andrew Bailey', party: 'Republican' },
    representatives: [
      { name: 'Cori Bush', party: 'Democratic', district: '1st' },
      { name: 'Ann Wagner', party: 'Republican', district: '2nd' },
      { name: 'Blaine Luetkemeyer', party: 'Republican', district: '3rd' },
      { name: 'Mark Alford', party: 'Republican', district: '4th' },
      { name: 'Emanuel Cleaver', party: 'Democratic', district: '5th' },
      { name: 'Sam Graves', party: 'Republican', district: '6th' },
      { name: 'Eric Burlison', party: 'Republican', district: '7th' },
      { name: 'Jason Smith', party: 'Republican', district: '8th' },
    ]
  },
  'MT': {
    governor: { name: 'Greg Gianforte', party: 'Republican' },
    lieutenantGovernor: { name: 'Kristen Juras', party: 'Republican' },
    secretaryOfState: { name: 'Christi Jacobsen', party: 'Republican' },
    attorneyGeneral: { name: 'Austin Knudsen', party: 'Republican' },
    representatives: [
      { name: 'Ryan Zinke', party: 'Republican', district: '1st' },
      { name: 'Matt Rosendale', party: 'Republican', district: '2nd' },
    ]
  },
  'NE': {
    governor: { name: 'Pete Ricketts', party: 'Republican' },
    lieutenantGovernor: { name: 'Joe Kelly', party: 'Republican' },
    secretaryOfState: { name: 'Bob Evnen', party: 'Republican' },
    attorneyGeneral: { name: 'Mike Hilgers', party: 'Republican' },
    representatives: [
      { name: 'Mike Flood', party: 'Republican', district: '1st' },
      { name: 'Don Bacon', party: 'Republican', district: '2nd' },
      { name: 'Adrian Smith', party: 'Republican', district: '3rd' },
    ]
  },
  'NV': {
    governor: { name: 'Joe Lombardo', party: 'Republican' },
    lieutenantGovernor: { name: 'Stavros Anthony', party: 'Republican' },
    secretaryOfState: { name: 'Cisco Aguilar', party: 'Democratic' },
    attorneyGeneral: { name: 'Aaron Ford', party: 'Democratic' },
    representatives: [
      { name: 'Dina Titus', party: 'Democratic', district: '1st' },
      { name: 'Mark Amodei', party: 'Republican', district: '2nd' },
      { name: 'Susie Lee', party: 'Democratic', district: '3rd' },
      { name: 'Steven Horsford', party: 'Democratic', district: '4th' },
    ]
  },
  'NH': {
    governor: { name: 'Chris Sununu', party: 'Republican' },
    lieutenantGovernor: { name: 'N/A', party: 'N/A' }, // New Hampshire doesn't have this position
    secretaryOfState: { name: 'David Scanlan', party: 'Republican' },
    attorneyGeneral: { name: 'John Formella', party: 'Republican' },
    representatives: [
      { name: 'Chris Pappas', party: 'Democratic', district: '1st' },
      { name: 'Annie Kuster', party: 'Democratic', district: '2nd' },
    ]
  },
  'NJ': {
    governor: { name: 'Phil Murphy', party: 'Democratic' },
    lieutenantGovernor: { name: 'Sheila Oliver', party: 'Democratic' },
    secretaryOfState: { name: 'Tahesha Way', party: 'Democratic' },
    attorneyGeneral: { name: 'Matthew Platkin', party: 'Democratic' },
    representatives: [
      { name: 'Donald Norcross', party: 'Democratic', district: '1st' },
      { name: 'Jeff Van Drew', party: 'Republican', district: '2nd' },
      { name: 'Andy Kim', party: 'Democratic', district: '3rd' },
      { name: 'Chris Smith', party: 'Republican', district: '4th' },
      { name: 'Josh Gottheimer', party: 'Democratic', district: '5th' },
      { name: 'Frank Pallone', party: 'Democratic', district: '6th' },
      { name: 'Tom Kean Jr.', party: 'Republican', district: '7th' },
      { name: 'Rob Menendez', party: 'Democratic', district: '8th' },
      { name: 'Bill Pascrell', party: 'Democratic', district: '9th' },
      { name: 'Donald Payne Jr.', party: 'Democratic', district: '10th' },
      { name: 'Mikie Sherrill', party: 'Democratic', district: '11th' },
      { name: 'Bonnie Watson Coleman', party: 'Democratic', district: '12th' },
    ]
  },
  'NM': {
    governor: { name: 'Michelle Lujan Grisham', party: 'Democratic' },
    lieutenantGovernor: { name: 'Howie Morales', party: 'Democratic' },
    secretaryOfState: { name: 'Maggie Toulouse Oliver', party: 'Democratic' },
    attorneyGeneral: { name: 'Raúl Torrez', party: 'Democratic' },
    representatives: [
      { name: 'Melanie Stansbury', party: 'Democratic', district: '1st' },
      { name: 'Gabe Vasquez', party: 'Democratic', district: '2nd' },
      { name: 'Teresa Leger Fernandez', party: 'Democratic', district: '3rd' },
    ]
  },
  'NY': {
    governor: { name: 'Kathy Hochul', party: 'Democratic' },
    lieutenantGovernor: { name: 'Antonio Delgado', party: 'Democratic' },
    secretaryOfState: { name: 'Walter Mosley', party: 'Democratic' },
    attorneyGeneral: { name: 'Letitia James', party: 'Democratic' },
    representatives: [
      { name: 'Nick LaLota', party: 'Republican', district: '1st' },
      { name: 'Andrew Garbarino', party: 'Republican', district: '2nd' },
      { name: 'George Santos', party: 'Republican', district: '3rd' },
      { name: 'Anthony D\'Esposito', party: 'Republican', district: '4th' },
      { name: 'Gregory Meeks', party: 'Democratic', district: '5th' },
      { name: 'Grace Meng', party: 'Democratic', district: '6th' },
      { name: 'Nydia Velázquez', party: 'Democratic', district: '7th' },
      { name: 'Hakeem Jeffries', party: 'Democratic', district: '8th' },
      { name: 'Yvette Clarke', party: 'Democratic', district: '9th' },
      { name: 'Daniel Goldman', party: 'Democratic', district: '10th' },
      { name: 'Nicole Malliotakis', party: 'Republican', district: '11th' },
      { name: 'Jerrold Nadler', party: 'Democratic', district: '12th' },
      { name: 'Adriano Espaillat', party: 'Democratic', district: '13th' },
      { name: 'Alexandria Ocasio-Cortez', party: 'Democratic', district: '14th' },
      { name: 'Ritchie Torres', party: 'Democratic', district: '15th' },
      { name: 'Jamaal Bowman', party: 'Democratic', district: '16th' },
      { name: 'Mike Lawler', party: 'Republican', district: '17th' },
      { name: 'Pat Ryan', party: 'Democratic', district: '18th' },
      { name: 'Marcus Molinaro', party: 'Republican', district: '19th' },
      { name: 'Paul Tonko', party: 'Democratic', district: '20th' },
    ]
  },
  'NC': {
    governor: { name: 'Roy Cooper', party: 'Democratic' },
    lieutenantGovernor: { name: 'Mark Robinson', party: 'Republican' },
    secretaryOfState: { name: 'Elaine Marshall', party: 'Democratic' },
    attorneyGeneral: { name: 'Josh Stein', party: 'Democratic' },
    representatives: [
      { name: 'Don Davis', party: 'Democratic', district: '1st' },
      { name: 'Deborah Ross', party: 'Democratic', district: '2nd' },
      { name: 'Greg Murphy', party: 'Republican', district: '3rd' },
      { name: 'Valerie Foushee', party: 'Democratic', district: '4th' },
      { name: 'Virginia Foxx', party: 'Republican', district: '5th' },
      { name: 'Kathy Manning', party: 'Democratic', district: '6th' },
      { name: 'David Rouzer', party: 'Republican', district: '7th' },
      { name: 'Dan Bishop', party: 'Republican', district: '8th' },
      { name: 'Richard Hudson', party: 'Republican', district: '9th' },
      { name: 'Patrick McHenry', party: 'Republican', district: '10th' },
      { name: 'Chuck Edwards', party: 'Republican', district: '11th' },
      { name: 'Alma Adams', party: 'Democratic', district: '12th' },
      { name: 'Wiley Nickel', party: 'Democratic', district: '13th' },
      { name: 'Jeff Jackson', party: 'Democratic', district: '14th' },
    ]
  },
  'ND': {
    governor: { name: 'Doug Burgum', party: 'Republican' },
    lieutenantGovernor: { name: 'Brent Sanford', party: 'Republican' },
    secretaryOfState: { name: 'Michael Howe', party: 'Republican' },
    attorneyGeneral: { name: 'Drew Wrigley', party: 'Republican' },
    representatives: [
      { name: 'Kelly Armstrong', party: 'Republican', district: 'At-Large' },
    ]
  },
  'OH': {
    governor: { name: 'Mike DeWine', party: 'Republican' },
    lieutenantGovernor: { name: 'Jon Husted', party: 'Republican' },
    secretaryOfState: { name: 'Frank LaRose', party: 'Republican' },
    attorneyGeneral: { name: 'Dave Yost', party: 'Republican' },
    representatives: [
      { name: 'Greg Landsman', party: 'Democratic', district: '1st' },
      { name: 'Brad Wenstrup', party: 'Republican', district: '2nd' },
      { name: 'Joyce Beatty', party: 'Democratic', district: '3rd' },
      { name: 'Jim Jordan', party: 'Republican', district: '4th' },
      { name: 'Bob Latta', party: 'Republican', district: '5th' },
      { name: 'Bill Johnson', party: 'Republican', district: '6th' },
      { name: 'Max Miller', party: 'Republican', district: '7th' },
      { name: 'Warren Davidson', party: 'Republican', district: '8th' },
      { name: 'Marcy Kaptur', party: 'Democratic', district: '9th' },
      { name: 'Mike Turner', party: 'Republican', district: '10th' },
      { name: 'Shontel Brown', party: 'Democratic', district: '11th' },
      { name: 'Troy Balderson', party: 'Republican', district: '12th' },
      { name: 'Emilia Sykes', party: 'Democratic', district: '13th' },
      { name: 'David Joyce', party: 'Republican', district: '14th' },
      { name: 'Mike Carey', party: 'Republican', district: '15th' },
    ]
  },
  'OK': {
    governor: { name: 'Kevin Stitt', party: 'Republican' },
    lieutenantGovernor: { name: 'Matt Pinnell', party: 'Republican' },
    secretaryOfState: { name: 'Josh Cockroft', party: 'Republican' },
    attorneyGeneral: { name: 'Gentner Drummond', party: 'Republican' },
    representatives: [
      { name: 'Kevin Hern', party: 'Republican', district: '1st' },
      { name: 'Josh Brecheen', party: 'Republican', district: '2nd' },
      { name: 'Frank Lucas', party: 'Republican', district: '3rd' },
      { name: 'Tom Cole', party: 'Republican', district: '4th' },
      { name: 'Stephanie Bice', party: 'Republican', district: '5th' },
    ]
  },
  'OR': {
    governor: { name: 'Tina Kotek', party: 'Democratic' },
    lieutenantGovernor: { name: 'N/A', party: 'N/A' }, // Oregon doesn't have this position
    secretaryOfState: { name: 'LaVonne Griffin-Valade', party: 'Democratic' },
    attorneyGeneral: { name: 'Ellen Rosenblum', party: 'Democratic' },
    representatives: [
      { name: 'Suzanne Bonamici', party: 'Democratic', district: '1st' },
      { name: 'Cliff Bentz', party: 'Republican', district: '2nd' },
      { name: 'Earl Blumenauer', party: 'Democratic', district: '3rd' },
      { name: 'Val Hoyle', party: 'Democratic', district: '4th' },
      { name: 'Lori Chavez-DeRemer', party: 'Republican', district: '5th' },
      { name: 'Andrea Salinas', party: 'Democratic', district: '6th' },
    ]
  },
  'PA': {
    governor: { name: 'Josh Shapiro', party: 'Democratic' },
    lieutenantGovernor: { name: 'Austin Davis', party: 'Democratic' },
    secretaryOfState: { name: 'Al Schmidt', party: 'Republican' },
    attorneyGeneral: { name: 'Michelle Henry', party: 'Democratic' },
    representatives: [
      { name: 'Brian Fitzpatrick', party: 'Republican', district: '1st' },
      { name: 'Brendan Boyle', party: 'Democratic', district: '2nd' },
      { name: 'Dwight Evans', party: 'Democratic', district: '3rd' },
      { name: 'Madeleine Dean', party: 'Democratic', district: '4th' },
      { name: 'Mary Gay Scanlon', party: 'Democratic', district: '5th' },
      { name: 'Chrissy Houlahan', party: 'Democratic', district: '6th' },
      { name: 'Susan Wild', party: 'Democratic', district: '7th' },
      { name: 'Matt Cartwright', party: 'Democratic', district: '8th' },
      { name: 'Dan Meuser', party: 'Republican', district: '9th' },
      { name: 'Scott Perry', party: 'Republican', district: '10th' },
      { name: 'Lloyd Smucker', party: 'Republican', district: '11th' },
      { name: 'Summer Lee', party: 'Democratic', district: '12th' },
      { name: 'John Joyce', party: 'Republican', district: '13th' },
      { name: 'Guy Reschenthaler', party: 'Republican', district: '14th' },
      { name: 'Glenn Thompson', party: 'Republican', district: '15th' },
      { name: 'Mike Kelly', party: 'Republican', district: '16th' },
      { name: 'Chris Deluzio', party: 'Democratic', district: '17th' },
    ]
  },
  'RI': {
    governor: { name: 'Dan McKee', party: 'Democratic' },
    lieutenantGovernor: { name: 'Sabina Matos', party: 'Democratic' },
    secretaryOfState: { name: 'Gregg Amore', party: 'Democratic' },
    attorneyGeneral: { name: 'Peter Neronha', party: 'Democratic' },
    representatives: [
      { name: 'David Cicilline', party: 'Democratic', district: '1st' },
      { name: 'Seth Magaziner', party: 'Democratic', district: '2nd' },
    ]
  },
  'SC': {
    governor: { name: 'Henry McMaster', party: 'Republican' },
    lieutenantGovernor: { name: 'Pamela Evette', party: 'Republican' },
    secretaryOfState: { name: 'Mark Hammond', party: 'Republican' },
    attorneyGeneral: { name: 'Alan Wilson', party: 'Republican' },
    representatives: [
      { name: 'Nancy Mace', party: 'Republican', district: '1st' },
      { name: 'Joe Wilson', party: 'Republican', district: '2nd' },
      { name: 'Jeff Duncan', party: 'Republican', district: '3rd' },
      { name: 'William Timmons', party: 'Republican', district: '4th' },
      { name: 'Ralph Norman', party: 'Republican', district: '5th' },
      { name: 'Jim Clyburn', party: 'Democratic', district: '6th' },
      { name: 'Russell Fry', party: 'Republican', district: '7th' },
    ]
  },
  'SD': {
    governor: { name: 'Kristi Noem', party: 'Republican' },
    lieutenantGovernor: { name: 'Larry Rhoden', party: 'Republican' },
    secretaryOfState: { name: 'Monae Johnson', party: 'Republican' },
    attorneyGeneral: { name: 'Marty Jackley', party: 'Republican' },
    representatives: [
      { name: 'Dusty Johnson', party: 'Republican', district: 'At-Large' },
    ]
  },
  'TN': {
    governor: { name: 'Bill Lee', party: 'Republican' },
    lieutenantGovernor: { name: 'Randy McNally', party: 'Republican' },
    secretaryOfState: { name: 'Tre Hargett', party: 'Republican' },
    attorneyGeneral: { name: 'Jonathan Skrmetti', party: 'Republican' },
    representatives: [
      { name: 'Diana Harshbarger', party: 'Republican', district: '1st' },
      { name: 'Tim Burchett', party: 'Republican', district: '2nd' },
      { name: 'Chuck Fleischmann', party: 'Republican', district: '3rd' },
      { name: 'Scott DesJarlais', party: 'Republican', district: '4th' },
      { name: 'Andy Ogles', party: 'Republican', district: '5th' },
      { name: 'John Rose', party: 'Republican', district: '6th' },
      { name: 'Mark Green', party: 'Republican', district: '7th' },
      { name: 'David Kustoff', party: 'Republican', district: '8th' },
      { name: 'Steve Cohen', party: 'Democratic', district: '9th' },
    ]
  },
  'TX': {
    governor: { name: 'Greg Abbott', party: 'Republican' },
    lieutenantGovernor: { name: 'Dan Patrick', party: 'Republican' },
    secretaryOfState: { name: 'Jane Nelson', party: 'Republican' },
    attorneyGeneral: { name: 'Ken Paxton', party: 'Republican' },
    representatives: [
      { name: 'Nathaniel Moran', party: 'Republican', district: '1st' },
      { name: 'Dan Crenshaw', party: 'Republican', district: '2nd' },
      { name: 'Keith Self', party: 'Republican', district: '3rd' },
      { name: 'Pat Fallon', party: 'Republican', district: '4th' },
      { name: 'Lance Gooden', party: 'Republican', district: '5th' },
      { name: 'Jake Ellzey', party: 'Republican', district: '6th' },
      { name: 'Lizzie Fletcher', party: 'Democratic', district: '7th' },
      { name: 'Kevin Brady', party: 'Republican', district: '8th' },
      { name: 'Al Green', party: 'Democratic', district: '9th' },
      { name: 'Michael McCaul', party: 'Republican', district: '10th' },
      { name: 'August Pfluger', party: 'Republican', district: '11th' },
      { name: 'Kay Granger', party: 'Republican', district: '12th' },
      { name: 'Ronny Jackson', party: 'Republican', district: '13th' },
      { name: 'Randy Weber', party: 'Republican', district: '14th' },
      { name: 'Monica De La Cruz', party: 'Republican', district: '15th' },
      { name: 'Greg Casar', party: 'Democratic', district: '35th' },
      { name: 'Brian Babin', party: 'Republican', district: '36th' },
      { name: 'Lloyd Doggett', party: 'Democratic', district: '37th' },
      { name: 'Wesley Hunt', party: 'Republican', district: '38th' },
    ]
  },
  'UT': {
    governor: { name: 'Spencer Cox', party: 'Republican' },
    lieutenantGovernor: { name: 'Deidre Henderson', party: 'Republican' },
    secretaryOfState: { name: 'N/A', party: 'N/A' }, // Utah doesn't have this position
    attorneyGeneral: { name: 'Sean Reyes', party: 'Republican' },
    representatives: [
      { name: 'Blake Moore', party: 'Republican', district: '1st' },
      { name: 'Chris Stewart', party: 'Republican', district: '2nd' },
      { name: 'John Curtis', party: 'Republican', district: '3rd' },
      { name: 'Burgess Owens', party: 'Republican', district: '4th' },
    ]
  },
  'VT': {
    governor: { name: 'Phil Scott', party: 'Republican' },
    lieutenantGovernor: { name: 'David Zuckerman', party: 'Progressive' },
    secretaryOfState: { name: 'Sarah Copeland Hanzas', party: 'Democratic' },
    attorneyGeneral: { name: 'Charity Clark', party: 'Democratic' },
    representatives: [
      { name: 'Becca Balint', party: 'Democratic', district: 'At-Large' },
    ]
  },
  'VA': {
    governor: { name: 'Glenn Youngkin', party: 'Republican' },
    lieutenantGovernor: { name: 'Winsome Sears', party: 'Republican' },
    secretaryOfState: { name: 'N/A', party: 'N/A' }, // Virginia doesn't have this position
    attorneyGeneral: { name: 'Jason Miyares', party: 'Republican' },
    representatives: [
      { name: 'Rob Wittman', party: 'Republican', district: '1st' },
      { name: 'Jen Kiggans', party: 'Republican', district: '2nd' },
      { name: 'Bobby Scott', party: 'Democratic', district: '3rd' },
      { name: 'Jennifer McClellan', party: 'Democratic', district: '4th' },
      { name: 'Bob Good', party: 'Republican', district: '5th' },
      { name: 'Ben Cline', party: 'Republican', district: '6th' },
      { name: 'Abigail Spanberger', party: 'Democratic', district: '7th' },
      { name: 'Don Beyer', party: 'Democratic', district: '8th' },
      { name: 'Morgan Griffith', party: 'Republican', district: '9th' },
      { name: 'Jennifer Wexton', party: 'Democratic', district: '10th' },
      { name: 'Gerry Connolly', party: 'Democratic', district: '11th' },
    ]
  },
  'WA': {
    governor: { name: 'Jay Inslee', party: 'Democratic' },
    lieutenantGovernor: { name: 'Denny Heck', party: 'Democratic' },
    secretaryOfState: { name: 'Steve Hobbs', party: 'Democratic' },
    attorneyGeneral: { name: 'Bob Ferguson', party: 'Democratic' },
    representatives: [
      { name: 'Suzan DelBene', party: 'Democratic', district: '1st' },
      { name: 'Rick Larsen', party: 'Democratic', district: '2nd' },
      { name: 'Marie Gluesenkamp Perez', party: 'Democratic', district: '3rd' },
      { name: 'Dan Newhouse', party: 'Republican', district: '4th' },
      { name: 'Cathy McMorris Rodgers', party: 'Republican', district: '5th' },
      { name: 'Derek Kilmer', party: 'Democratic', district: '6th' },
      { name: 'Pramila Jayapal', party: 'Democratic', district: '7th' },
      { name: 'Kim Schrier', party: 'Democratic', district: '8th' },
      { name: 'Adam Smith', party: 'Democratic', district: '9th' },
      { name: 'Marilyn Strickland', party: 'Democratic', district: '10th' },
    ]
  },
  'WV': {
    governor: { name: 'Jim Justice', party: 'Republican' },
    lieutenantGovernor: { name: 'N/A', party: 'N/A' }, // West Virginia doesn't have this position
    secretaryOfState: { name: 'Mac Warner', party: 'Republican' },
    attorneyGeneral: { name: 'Patrick Morrisey', party: 'Republican' },
    representatives: [
      { name: 'Carol Miller', party: 'Republican', district: '1st' },
      { name: 'Alex Mooney', party: 'Republican', district: '2nd' },
    ]
  },
  'WI': {
    governor: { name: 'Tony Evers', party: 'Democratic' },
    lieutenantGovernor: { name: 'Sara Rodriguez', party: 'Democratic' },
    secretaryOfState: { name: 'Sarah Godlewski', party: 'Democratic' },
    attorneyGeneral: { name: 'Josh Kaul', party: 'Democratic' },
    representatives: [
      { name: 'Bryan Steil', party: 'Republican', district: '1st' },
      { name: 'Mark Pocan', party: 'Democratic', district: '2nd' },
      { name: 'Derrick Van Orden', party: 'Republican', district: '3rd' },
      { name: 'Gwen Moore', party: 'Democratic', district: '4th' },
      { name: 'Scott Fitzgerald', party: 'Republican', district: '5th' },
      { name: 'Glenn Grothman', party: 'Republican', district: '6th' },
      { name: 'Tom Tiffany', party: 'Republican', district: '7th' },
      { name: 'Mike Gallagher', party: 'Republican', district: '8th' },
    ]
  },
  'WY': {
    governor: { name: 'Mark Gordon', party: 'Republican' },
    lieutenantGovernor: { name: 'N/A', party: 'N/A' }, // Wyoming doesn't have this position
    secretaryOfState: { name: 'Chuck Gray', party: 'Republican' },
    attorneyGeneral: { name: 'Bridget Hill', party: 'Republican' },
    representatives: [
      { name: 'Harriet Hageman', party: 'Republican', district: 'At-Large' },
    ]
  },
};

export default function StateDetailsScreen() {
  const [selectedState, setSelectedState] = useState(null);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const { getScaledFontSize, getAccessibleColors } = useAccessibility();
  
  const accessibleColors = getAccessibleColors();

  useEffect(() => {
    detectUserState();
  }, []);

  const detectUserState = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationLoading(false);
        setSelectedState({ code: 'CA', name: 'California' });
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const stateFromCoords = getStateFromCoordinates(location.coords.latitude, location.coords.longitude);
      setSelectedState(stateFromCoords);
      setLocationLoading(false);
    } catch (error) {
      console.error('Error detecting location:', error);
      setSelectedState({ code: 'CA', name: 'California' });
      setLocationLoading(false);
    }
  };

  const getStateFromCoordinates = (latitude, longitude) => {
    if (latitude >= 32.5 && latitude <= 42 && longitude >= -124.4 && longitude <= -114.1) {
      return { code: 'CA', name: 'California' };
    } else if (latitude >= 25.8 && latitude <= 36.5 && longitude >= -106.6 && longitude <= -93.5) {
      return { code: 'TX', name: 'Texas' };
    } else if (latitude >= 40.4 && latitude <= 45.0 && longitude >= -79.8 && longitude <= -71.8) {
      return { code: 'NY', name: 'New York' };
    } else if (latitude >= 24.5 && latitude <= 31.0 && longitude >= -87.6 && longitude <= -80.0) {
      return { code: 'FL', name: 'Florida' };
    }
    return { code: 'CA', name: 'California' };
  };

  const getPartyColor = (party) => {
    switch (party) {
      case 'Democratic': return '#1e40af';
      case 'Republican': return '#dc2626';
      case 'Independent': return '#059669';
      default: return '#6b7280';
    }
  };

  const getPartyAbbreviation = (party) => {
    switch (party) {
      case 'Democratic': return 'D';
      case 'Republican': return 'R';
      case 'Independent': return 'I';
      default: return '?';
    }
  };

  const stateData = selectedState ? STATE_OFFICIALS[selectedState.code] : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: getScaledFontSize(24) }]}>
          State Details
        </Text>
        <Text style={[styles.subtitle, { fontSize: getScaledFontSize(16) }]}>
          State Government Officials
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.stateSelector}>
          <Text style={[styles.sectionTitle, { fontSize: getScaledFontSize(18) }]}>
            State
          </Text>
          <TouchableOpacity
            style={styles.stateButton}
            onPress={() => setStateModalVisible(true)}
            accessibilityLabel="Select state"
          >
            <Text style={[styles.stateButtonText, { fontSize: getScaledFontSize(16) }]}>
              {locationLoading ? 'Detecting state...' : selectedState ? selectedState.name : 'Select State'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {stateData && (
          <View style={styles.officialsContainer}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: getScaledFontSize(18) }]}>
                Executive Branch
              </Text>
              
              {['governor', 'lieutenantGovernor', 'secretaryOfState', 'attorneyGeneral'].map((role) => {
                const titles = {
                  governor: 'Governor',
                  lieutenantGovernor: 'Lieutenant Governor',
                  secretaryOfState: 'Secretary of State',
                  attorneyGeneral: 'Attorney General'
                };
                const official = stateData[role];
                
                return (
                  <View key={role} style={styles.officialCard}>
                    <Text style={[styles.officialTitle, { fontSize: getScaledFontSize(14) }]}>
                      {titles[role]}
                    </Text>
                    <View style={styles.officialInfo}>
                      <Text style={[styles.officialName, { fontSize: getScaledFontSize(16) }]}>
                        {official.name}
                      </Text>
                      <View style={[styles.partyBadge, { backgroundColor: getPartyColor(official.party) }]}>
                        <Text style={[styles.partyText, { fontSize: getScaledFontSize(12) }]}>
                          {getPartyAbbreviation(official.party)}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.partyFullName, { fontSize: getScaledFontSize(12) }]}>
                      {official.party}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: getScaledFontSize(18) }]}>
                U.S. House of Representatives
              </Text>
              <Text style={[styles.sectionSubtitle, { fontSize: getScaledFontSize(14) }]}>
                {stateData.representatives.length} Representatives
              </Text>
              
              {stateData.representatives.map((rep, index) => (
                <View key={index} style={styles.representativeCard}>
                  <View style={styles.repHeader}>
                    <Text style={[styles.districtText, { fontSize: getScaledFontSize(12) }]}>
                      {rep.district} District
                    </Text>
                    <View style={[styles.partyBadge, { backgroundColor: getPartyColor(rep.party) }]}>
                      <Text style={[styles.partyText, { fontSize: getScaledFontSize(12) }]}>
                        {getPartyAbbreviation(rep.party)}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.repName, { fontSize: getScaledFontSize(16) }]}>
                    {rep.name}
                  </Text>
                  <Text style={[styles.partyFullName, { fontSize: getScaledFontSize(12) }]}>
                    {rep.party}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {!stateData && selectedState && (
          <View style={styles.noDataContainer}>
            <Text style={[styles.noDataText, { fontSize: getScaledFontSize(16) }]}>
              State data for {selectedState.name} is not yet available.
            </Text>
            <Text style={[styles.noDataSubtext, { fontSize: getScaledFontSize(14) }]}>
              We're working to add comprehensive data for all 50 states.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky Footer with Last Updated Date */}
      <View style={[styles.stickyFooter, { backgroundColor: accessibleColors.surface }]}>
        <Text style={[styles.lastUpdatedText, { color: accessibleColors.textSecondary, fontSize: getScaledFontSize(12) }]}>
          Data last updated: August 7, 2025
        </Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={stateModalVisible}
        onRequestClose={() => setStateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontSize: getScaledFontSize(18) }]}>
                Select State
              </Text>
              <TouchableOpacity
                onPress={() => setStateModalVisible(false)}
                accessibilityLabel="Close state selection"
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {US_STATES.map((state) => (
                <Pressable
                  key={state.code}
                  style={[
                    styles.stateOption,
                    selectedState?.code === state.code && styles.selectedStateOption
                  ]}
                  onPress={() => {
                    setSelectedState(state);
                    setStateModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.stateOptionText,
                    { fontSize: getScaledFontSize(16) },
                    selectedState?.code === state.code && styles.selectedStateText
                  ]}>
                    {state.name}
                  </Text>
                  {selectedState?.code === state.code && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, backgroundColor: colors.primary, alignItems: 'center' },
  title: { fontWeight: 'bold', color: colors.white, marginBottom: 4 },
  subtitle: { color: colors.white, opacity: 0.9 },
  content: { flex: 1 },
  stateSelector: { padding: 16, backgroundColor: colors.white, marginBottom: 8 },
  sectionTitle: { fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
  stateButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.lightGray },
  stateButtonText: { color: colors.textPrimary, fontWeight: '500' },
  officialsContainer: { padding: 16 },
  section: { marginBottom: 24 },
  sectionSubtitle: { color: colors.textSecondary, marginBottom: 16, fontStyle: 'italic' },
  officialCard: { backgroundColor: colors.white, padding: 16, borderRadius: 8, marginBottom: 12, shadowColor: colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  officialTitle: { color: colors.textSecondary, fontWeight: '500', marginBottom: 8 },
  officialInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  officialName: { fontWeight: 'bold', color: colors.textPrimary, flex: 1 },
  partyBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
  partyText: { color: colors.white, fontWeight: 'bold' },
  partyFullName: { color: colors.textSecondary, fontStyle: 'italic' },
  representativeCard: { backgroundColor: colors.surface, padding: 12, borderRadius: 8, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: colors.primary },
  repHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  districtText: { color: colors.textSecondary, fontWeight: '500' },
  repName: { fontWeight: 'bold', color: colors.textPrimary, marginBottom: 4 },
  noDataContainer: { padding: 32, alignItems: 'center' },
  noDataText: { color: colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  noDataSubtext: { color: colors.textSecondary, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.white, borderRadius: 12, width: '90%', maxWidth: 400, maxHeight: '80%', shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 8 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.lightGray },
  modalTitle: { fontWeight: 'bold', color: colors.textPrimary },
  modalBody: { maxHeight: 400 },
  stateOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.lightGray },
  selectedStateOption: { backgroundColor: colors.primaryLight },
  stateOptionText: { color: colors.textPrimary },
  selectedStateText: { color: colors.primary, fontWeight: '600' },
  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.lightGray },
  lastUpdatedText: { color: colors.textSecondary, textAlign: 'center' },
});
