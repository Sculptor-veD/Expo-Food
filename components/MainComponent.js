import * as React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import AboutComponent from "./AboutComponent";
import ContactComponent from "./ContactComponent";
import MenuComponent from "./MenuComponent";
import DishdetailComponent from "./DishdetailComponent.js";
import Favorites from "./FavoriteComponent";
import Reservation from "./ReservationComponent";
import { createDrawerNavigator } from "react-navigation-drawer";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import Login from "./LoginComponent";
import {
  fetchDishes,
  fetchComments,
  fetchPromos,
  fetchLeaders,
} from "../components/redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders,
  };
};
const mapDispatchToProps = (dispatch) => ({
  fetchDishes: () => dispatch(fetchDishes()),
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders: () => dispatch(fetchLeaders()),
});

const screen1Navigator = createStackNavigator({
  screenOne: {
    screen: AboutComponent,
    navigationOptions: {
      title: "About Us",
    },
  },
});
const screen2Navigator = createStackNavigator({
  screenTwo: {
    screen: ContactComponent,
    navigationOptions: {
      title: "Contact Us",
    },
  },
});
const MenuNavigator = createStackNavigator({
  MenuScreen: {
    screen: MenuComponent,
    navigationOptions: {
      title: "Menu",
    },
  },
  Dishdetail: {
    screen: DishdetailComponent,
  },
});
const FavoritesNavigator = createStackNavigator(
  {
    Favorites: { screen: Favorites },
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "#512DA8",
      },
      headerTitleStyle: {
        color: "#fff",
      },
      headerTintColor: "#fff",
    }),
  }
);
const ReservationNavigator = createStackNavigator(
  {
    Reservation: { screen: Reservation },
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "#512DA8",
      },
      headerTitleStyle: {
        color: "#fff",
      },
      headerTintColor: "#fff",
      headerLeft: (
        <Icon
          name="menu"
          size={24}
          iconStyle={{ color: "white" }}
          onPress={() => navigation.navigate("DrawerToggle")}
        />
      ),
    }),
  }
);
const LoginNavigator = createStackNavigator(
  {
    Login: { screen: Login },
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "#512DA8",
      },
      headerTitleStyle: {
        color: "#fff",
      },
      headerTintColor: "#fff",
      headerLeft: (
        <Icon
          name="menu"
          size={24}
          iconStyle={{ color: "white" }}
          onPress={() => navigation.toggleDrawer()}
        />
      ),
    }),
  }
);
const myDrawer = createDrawerNavigator(
  {
    AboutUs: {
      screen: screen1Navigator,
    },
    ContactUs: {
      screen: screen2Navigator,
    },
    Menu: {
      screen: MenuNavigator,
    },
    Favorites: {
      screen: FavoritesNavigator,
      navigationOptions: {
        title: "My Favorites",
        drawerLabel: "My Favorites",
        drawerIcon: ({ tintColor, focused }) => (
          <Icon
            name="heart"
            type="font-awesome"
            size={24}
            iconStyle={{ color: tintColor }}
          />
        ),
      },
    },
    Login: {
      screen: LoginNavigator,
      navigationOptions: {
        title: "Login",
        drawerLabel: "Login",
        drawerIcon: ({ tintColor, focused }) => (
          <Icon
            name="sign-in"
            type="font-awesome"
            size={24}
            iconStyle={{ color: tintColor }}
          />
        ),
      },
    },

    Reservation: {
      screen: ReservationNavigator,
      navigationOptions: {
        title: "Reserve Table",
        drawerLabel: "Reserve Table",
        drawerIcon: ({ tintColor, focused }) => (
          <Icon
            name="cutlery"
            type="font-awesome"
            size={24}
            iconStyle={{ color: tintColor }}
          />
        ),
      },
    },
  },
  {
    drawerBackgroundColor: "white",
    initialRouteName: "Reservation",
  }
);
const AppContainer = createAppContainer(myDrawer);
class Main extends React.Component {
  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }
  render() {
    return <AppContainer />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
