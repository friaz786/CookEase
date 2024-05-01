import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, CheckBox } from 'react-native';
import { Calendar } from 'react-native-calendars';
import firebase from 'firebase/app';
import 'firebase/firestore';

const MealPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');

  const [mealPlan, setMealPlan] = useState(null);

  
  return ( 
    <>
    <ScrollView>
      <View>
        <TouchableOpacity onPress={() => setShowCalendar(true)}>
          <Text>Open Calendar</Text>
        </TouchableOpacity>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          // Customize the calendar as needed
        />
      </View>

      {selectedDate && (
        <View>
          <Text>Selected Date: {selectedDate}</Text>
          <TextInput
            placeholder="Breakfast"
            value={breakfast}
            onChangeText={(text) => setBreakfast(text)}
          />
          <TextInput
            placeholder="Lunch"
            value={lunch}
            onChangeText={(text) => setLunch(text)}
          />
          <TextInput
            placeholder="Dinner"
            value={dinner}
            onChangeText={(text) => setDinner(text)}
          />
          <TouchableOpacity>
            <Text>Save Meal Plan</Text>
          </TouchableOpacity>
        </View>
      )}

      {mealPlan && (
        <View>
          <Text>Meal Plan for {selectedDate}</Text>
          <Text>Breakfast: {mealPlan.breakfast}</Text>
          <Text>Lunch: {mealPlan.lunch}</Text>
          <Text>Dinner: {mealPlan.dinner}</Text>
        </View>
      )}
    </ScrollView>
    </>
  );
};

export default MealPlanner;
