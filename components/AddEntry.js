import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getMetricMetaInfo, timeToString, getDailyReminderNofification } from '../utils/helpers';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { connect } from 'react-redux';
import DateHeader from './DateHeader';
import UdaciSlider from './UdaciSlider';
import UdaciStepper from './UdaciStepper'
import TextButton from './TextButton';
import { addEntry } from '../actions';
import { submitEntry, removeEntry } from '../utils/api'

function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}>
      <Text>SUBMIT</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  };
  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState((prevState) => {
      const count = prevState[metric] + step;
      return {
        ...prevState,
        [metric] : count > max ? max : count
      }
    })
  };
  decrement = (metric) => {
    this.setState((prevState) => {
      const count = prevState[metric] - getMetricMetaInfo(metric).step;
      return {
        ...prevState,
        [metric] : count < 0 ? 0 : count
      }
    })
  };
  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }))
  };
  submit = () => {
    const key = timeToString();
    const entry = this.state;
    // Update redux
    this.props.dispatch(addEntry({
      [key]: entry
    }))
    // Reset state
    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    }))
    // Navigate Home
    submitEntry({ entry, key });
    // Clear Local Notifications
  };
  reset = () => {
    const key = timeToString();
    // ToDo List
    // Update Redux
    this.props.dispatch(addEntry({
      [key]: getDailyReminderNofification()
    }))
    // Route to home
    removeEntry(key);
  }
  render() {
    const metaInfo = getMetricMetaInfo();
    if(this.props.alreadyLogged) {
      return(
        <View>
          <MaterialCommunityIcons
            name="emoticon-happy-outline" size={100} color="black" />
          <Text>You already Logged your information for today</Text>
          <TextButton onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }
    return(
      <View>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map((key) => {
          const {getIcon, type, ...rest} = metaInfo[key];
          const value = this.state[key];
          return (
            <View key={key}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider
                    value={value}
                    onChange={(value) => {this.slide(key, value)}}
                    {...rest}
                  />
                : <UdaciStepper
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />
              }
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    )
  }
}

function mapStateToProps(state) {
  const key = timeToString();
  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStateToProps)(AddEntry);