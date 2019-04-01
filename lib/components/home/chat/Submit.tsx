import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import { Query, Mutation, QueryResult } from "react-apollo";
import gql from "graphql-tag";

const SUBMIT_NEW_MESSAGE = gql`
  mutation data($clientMutationId: String, $roomId: ID!, $source: String!, $format: MessageFormat) {
    createMessage(input: { clientMutationId: $clientMutationId, roomId: $roomId, source: $source, format: $format }) {
      clientMutationId
    }
  }
`;

type Props = {
  room: { id: string | null; name: string | null; description: string | null };
};

type State = {
  source: string;
};

export default class Submit extends React.Component<Props, State> {
  private submitFormInput: Input | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      source: "",
    };
  }

  onChangeText = (text: string) => {
    this.setState({ source: text });
  };

  render() {
    return (
      <Mutation mutation={SUBMIT_NEW_MESSAGE}>
        {(submit, { loading, error }) => (
          <View style={styles.submitForm}>
            <Input
              ref={elem => (this.submitFormInput = elem)}
              containerStyle={styles.submitFormInputContainer}
              inputContainerStyle={styles.submitFormInputInputContainer}
              editable={!loading}
              multiline={true}
              numberOfLines={1}
              placeholder="Write a message"
              onChangeText={this.onChangeText}
            />
            <Button
              containerStyle={styles.submitFormButtonContainer}
              disabled={loading}
              raised={true}
              type="outline"
              icon={<Icon name="send" />}
              onPress={e => {
                submit({ variables: { roomId: this.props.room.id, source: this.state.source } });
                if (this.submitFormInput) {
                  this.submitFormInput.clear();
                }
              }}
            />
          </View>
        )}
      </Mutation>
    );
  }
}
const styles = StyleSheet.create({
  submitForm: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#DDD",
  },
  submitFormInputContainer: {
    flex: 0.85,
    justifyContent: "center",
    marginTop: 5,
  },
  submitFormInputInputContainer: {
    borderBottomWidth: 0,
  },
  submitFormButtonContainer: { flex: 0.15, margin: 5 },
});
