import * as React from 'react';
import {ScrollView, Text, View, StyleSheet, FlatList} from 'react-native';
import {useState, useEffect} from 'react';
import {ListItem, Card, Avatar} from 'react-native-elements';
import {connect} from 'react-redux';
import {baseUrl} from './shared/baseUrl';
import {Loading} from './LoadingComponent';

class About extends React.Component {
  render() {
    const renderLeader = ({item, index}) => {
      return (
        <View>
          <ListItem bottomDivider>
            <Avatar rounded source={{uri: baseUrl + item.image}} />
            <ListItem.Title>{item.name}</ListItem.Title>
            <ListItem.Subtitle>{item.designation}</ListItem.Subtitle>
          </ListItem>
        </View>
      );
    };
    if (this.props.leaders.isLoading) {
      return (
        <ScrollView>
          <Card title="Corporate Leadership">
            <Loading />
          </Card>
        </ScrollView>
      );
    } else if (this.props.leaders.errMess) {
      return (
        <ScrollView>
          <Card title="Corporate Leadership">
            <Text>{this.props.leaders.errMess}</Text>
          </Card>
        </ScrollView>
      );
    } else {
      return (
        <ScrollView>
          <Card title="Corporate Leadership">
            <FlatList
              data={this.props.leaders.leaders}
              renderItem={renderLeader}
              keyExtractor={(item) => item.id.toString()}
            />
          </Card>
        </ScrollView>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    leaders: state.leaders,
  };
};
export default connect(mapStateToProps)(About);
