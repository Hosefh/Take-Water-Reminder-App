import React from 'react'
import { Text, View, StyleSheet } from "react-native"
const Test2 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainBodyText}>Settings will be available soon.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: 10,
  },
  main: {
    padding: 4,
    marginTop: 4,
  },
  mainHeaderText: {
    marginTop: 4,
    padding: 2,
    fontSize: 20,
    fontWeight: "bold",
  },
  mainBodyText: {
    padding: 2,
    fontSize: 16,
  },
})

export default Test2