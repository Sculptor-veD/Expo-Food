import React, { Component } from "react";
import { FlatList, View, Text } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { connect } from "react-redux";
import { Loading } from "./LoadingComponent";
import { baseUrl } from "./shared/baseUrl";
import * as Animatable from 'react-native-animatable';

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    favorites: state.favorites,
  };
};

class Favorites extends Component {
  static navigationOptions = {
    title: "My Favorites",
  };

  render() {
    const { navigate } = this.props.navigation;
    const renderMenuItem = ({ item, index }) => {
      return (
        // <ListItem
        //   key={index}
        //   title={item.name}
        //   subtitle={item.description}
        //   hideChevron={true}
        //   onPress={() => navigate('Dishdetail', {dishId: item.id})}
        //   leftAvatar={{source: {uri: baseUrl + item.image}}}
        // />
        <Animatable.View animation="fadeInRightBig" duration={2000}>
          <ListItem
            bottomDivider
            onPress={() => navigate("Dishdetail", { dishId: item.id })}
          >
            <Avatar source={{ uri: baseUrl + item.image }} />
            <ListItem.Title>{item.name}</ListItem.Title>
            <ListItem.Subtitle style={{ flex: 1 }}>
              {item.description}
            </ListItem.Subtitle>
            <ListItem.Chevron />
          </ListItem>
        </Animatable.View>
      );
    };

    if (this.props.dishes.isLoading) {
      return <Loading />;
    } else if (this.props.dishes.errMess) {
      return (
        <View>
          <Text>{this.props.dishes.errMess}</Text>
        </View>
      );
    } else {
      return (
        <FlatList
          data={this.props.dishes.dishes.filter((dish) =>
            this.props.favorites.some((el) => el === dish.id)
          )}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id.toString()}
        />
      );
    }
  }
}

export default connect(mapStateToProps)(Favorites);
