import React from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  LogBox,
  Modal,
  StyleSheet,
  PanResponder,
  Alert,
} from 'react-native';
import {Button, Card, Icon, Input, Rating} from 'react-native-elements';
import {connect} from 'react-redux';
import {
  postComment,
  postNewFavorite,
  removeFavorite,
} from './redux/ActionCreators';
import {baseUrl} from './shared/baseUrl';
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
]);
import * as Animatable from 'react-native-animatable';
const recognizeComment = ({moveX, moveY, dx, dy}) => {
  if (dx > 200) return true;
  else return false;
};
function RenderDish(props) {
  const dish = props.dish;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => {
      return true;
    },
    onPanResponderEnd: (e, gestureState) => {
      console.log('pan responder end', gestureState);
      if (recognizeComment(gestureState)) props.ModalOpen();

      return true;
    },
  });
  if (dish != null) {
    return (
      <Animatable.View
        animation="fadeInDown"
        duration={2000}
        delay={1000}
        {...panResponder.panHandlers}>
        <Card>
          <Card.Image source={{uri: baseUrl + dish.image}}>
            <Card.FeaturedTitle>{dish.name}</Card.FeaturedTitle>
          </Card.Image>
          <Text style={{margin: 10}}>{dish.description}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <Icon
              raised
              reverse
              name={props.favorite ? 'heart' : 'heart-o'}
              type="font-awesome"
              color="#f50"
              onPress={() =>
                props.favorite ? props.onRemove() : props.onPress()
              }
              // onPress={() => props.onPress()}
            />
            <Icon
              raised
              reverse
              name={'pencil'}
              type="font-awesome"
              color="blue"
              onPress={() => props.openModal()}
            />
          </View>
        </Card>
      </Animatable.View>
    );
  } else {
    return <View></View>;
  }
}

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({item, index}) => {
    return (
      <View key={index} style={{margin: 10}}>
        <Text style={{fontSize: 14}}>{item.comment}</Text>
        <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
        <Text style={{fontSize: 12}}>
          {'-- ' + item.author + ', ' + item.date}{' '}
        </Text>
      </View>
    );
  };

  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card>
        <Card.Title>Comments</Card.Title>
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </Card>
    </Animatable.View>
  );
}

class DishDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      rating: null,
      comment: null,
      author: null,
      btnVisible: false,
    };
  }
  static navigationOptions = {
    title: 'Dish Details',
  };
  markFavorite(dishId) {
    // if (this.props.favorites.some((el) => el === dishId))
    //   this.props.removeFavorite(dishId);
    //else
    this.props.postNewFavorite(dishId);
    console.log(this.props.favorites);
  }
  addingComment() {
    this.setState({modalVisible: !this.state.modalVisible});
  }
  handleComment(dishId, rating, comment, author) {
    console.log(this.props.comments.comments);
    if (this.state.author !== null) {
      this.props.postComment(dishId, rating, comment, author);
      this.setState({modalVisible: false});
    } else {
      Alert.alert('You must fill in something');
    }
  }
  DeleteFavorite(dishId) {
    this.props.removeFavorite(dishId);
  }
  render() {
    const dishId = this.props.navigation.getParam('dishId', '');
    const {modalVisible, rating, author, comment} = this.state;

    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some((el) => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          onRemove={() => this.DeleteFavorite(dishId)}
          openModal={() => this.addingComment()}
          ModalOpen={() => this.setState({modalVisible: true})}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            (commentDetail) => commentDetail.dishId === dishId,
          )}
        />
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Rating
                defaultRating={5}
                showRating
                onFinishRating={(ratingValue) =>
                  this.setState({rating: ratingValue})
                }
              />
              <Input
                placeholder="Author"
                leftIcon={
                  <Icon
                    name="user"
                    size={24}
                    color="black"
                    type="font-awesome"
                  />
                }
                onChangeText={(value) => this.setState({author: value})}
              />
              <Input
                placeholder="Comment"
                leftIcon={
                  <Icon
                    name="comment"
                    size={24}
                    color="black"
                    type="font-awesome"
                  />
                }
                onChangeText={(value) => this.setState({comment: value})}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  width: 500,
                }}>
                <Button
                  title="Submit"
                  type="solid"
                  disabled={this.state.btnVisible}
                  onPress={() =>
                    this.handleComment(dishId, rating, comment, author)
                  }
                />
                <Button
                  title="Cancel"
                  type="solid"
                  onPress={() => this.setState({modalVisible: false})}
                />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites,
  };
};
const mapDispatchtoProps = (dispatch) => ({
  postComment: (dishId, rating, author, comments) => {
    dispatch(postComment(dishId, rating, author, comments));
  },
  postNewFavorite: (dishId) => dispatch(postNewFavorite(dishId)),
  removeFavorite: (dishId) => dispatch(removeFavorite(dishId)),
});
export default connect(mapStateToProps, mapDispatchtoProps)(DishDetail);
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    flex: 1,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
