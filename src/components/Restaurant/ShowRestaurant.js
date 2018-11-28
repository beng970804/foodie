import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

class ShowRestaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <View style={{ width: this.props.width / 2 - 30, height: this.props.width / 2 - 30, borderWidth: 0.7, borderColor: '#dddddd', marginBottom: 15}}>
            <View style={{ flex: 1 }}>
                <Image
                    style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }}
                    source={this.props.imageUri} />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'space-evenly', paddingLeft: 10 }}>
                <Text style={{ fontSize: 12, color: '#b63838' }}>{this.props.type}</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{this.props.name}</Text>
                <Text style={{ fontSize: 12 }}>Average: {this.props.price}$</Text>
                {/* <StarRating
                    disable={true}
                    maxStars={5}
                    rating={this.props.rating}
                    starSize={10}
                /> */}
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ShowRestaurant;
