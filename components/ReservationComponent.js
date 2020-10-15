import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Switch,
  Button,
  PanResponder,
  Alert,
} from "react-native";
import { Card } from "react-native-elements";
import DatePicker from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-community/picker";
import * as Animatable from "react-native-animatable";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as Calendar from "expo-calendar";
class Reservation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      guests: 1,
      smoking: false,
      date: new Date(),
      showmode: false,
    };
  }

  static navigationOptions = {
    title: "Reserve Table",
  };
  async presentLocalNotification(date) {
    // await this.obtainNotificationPermission();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Your Reservation",
        body: "Reservation for " + date + " requested",
      },
      trigger: null,
    });
  }
  handleReservation() {
    Alert.alert(
      "Your Reservation OK?",
      `Number of guests : ${this.state.guests}
Smoking? ${this.state.smoking.toString()}
Date and Time: ${this.state.date.toUTCString()}`,
      [
        {
          text: "Cancel",
          onPress: () =>
            this.setState({
              guests: 1,
              smoking: false,
              date: new Date(),
            }),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            this.setState({
              guests: 1,
              smoking: false,
              date: new Date(),
            });
            this.presentLocalNotification(this.state.date);
            this.addReservationToCalendar(this.state.date);
          },
        },
      ],
      { cancelable: false }
    );
  }
  obtainCalendarPermission = async () => {
    const calendarPermission = await Permissions.askAsync(Permissions.CALENDAR);
    if (calendarPermission.status !== "granted")
      Alert.alert("Permission not granted");
    else if (calendarPermission.status === "granted")
      await Calendar.getCalendarsAsync();
    return calendarPermission;
  };
  
  async  addReservationToCalendar(date) {
    await this.obtainCalendarPermission();
    const defaultCalendarSource =
      Platform.OS === 'ios'
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Expo Calendar' };
    const newCalendarID = await Calendar.createCalendarAsync({
      title: 'Expo Calendar',
      color: 'blue',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: 'internalCalendarName',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    console.log(`Your new calendar ID is: ${newCalendarID}`);
    await Calendar.createEventAsync(newCalendarID,{
      title:'Con Fusion Table Reservation',
      startDate: new Date() ,
      endDate: new Date(date),
      timeZone: "Asia/Hong_Kong",
      location:
        "121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong",
    })
  }
  render() {
    return (
      <Animatable.View animation="zoomIn" duration={2000}>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Number of Guests</Text>
          <Picker
            selectedValue={this.state.guests}
            style={styles.formItem}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ guests: itemValue })
            }
          >
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="6" />
          </Picker>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
          <Switch
            style={styles.formItem}
            value={this.state.smoking}
            onTintColor="#512DA8"
            onValueChange={(value) => this.setState({ smoking: value })}
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Date and Time</Text>
          <Text
            onPress={() => this.setState({ showmode: !this.state.showmode })}
          >
            {this.state.date.toUTCString()}
          </Text>
        </View>
        <View style={styles.formRow}>
          <DatePicker
            isVisible={this.state.showmode}
            mode="date"
            onConfirm={(date) => this.setState({ date: date })}
            onCancel={() => this.setState({ showmode: !this.state.showmode })}
          />
          <Button
            onPress={() => this.handleReservation()}
            title="Reserve"
            color="#512DA8"
            accessibilityLabel="Learn more about this purple button"
          />
         
          {/* <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Your Reservation OK?</Text>
                <Text>Number of guests : {this.state.guests} </Text>
                <Text>Smoking? {this.state.smoking.toString()} </Text>
                <Text>Date and Time: {this.state.date.toUTCString()}</Text>
                <Button
                  title="CLOSE"
                  onPress={() => this.setState({modalVisible: false})}
                />
              </View>
            </View>
          </Modal> */}
        </View>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  formLabel: {
    fontSize: 18,
    flex: 2,
  },
  formItem: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    height: 300,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    fontWeight: "bold",
  },
});

export default Reservation;
