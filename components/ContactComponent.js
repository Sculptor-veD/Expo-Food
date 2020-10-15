import * as React from 'react';
import {Text, View} from 'react-native';
import {Card} from 'react-native-elements';

class ContactComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <Card>
          <Card.Title>Contact Infomation</Card.Title>
          <Text>
            {`
                 121, Clear Water Bay Road 
                 Clear Water Bay, Kowloon 
                 HONG KONG 
                 Tel: +852 1234 5678 
                 Fax: +852 8765 4321 
                 Email:confusion@food.net`}
          </Text>
        </Card>
      </View>
    );
  }
}
export default ContactComponent;
