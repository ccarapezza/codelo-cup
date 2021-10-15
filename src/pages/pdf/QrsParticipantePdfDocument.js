import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  body: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 35,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  name: {
    fontSize: 12,
    textTransform: "uppercase"
  },
  image: {
    width: "150pt",
    height: "150pt",
  },
  participante:{
    border: "1pt",
    borderColor: "black",
    width: "170pt",
    height: "180pt",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginRight: 5,
  }
});

export default function QrsParticipantePdfDocument({participantes}){
  return(<Document>
    <Page size="A4" style={styles.body} wrap>
      {participantes?.map((participante)=>{
        return(<View style={styles.participante}>
          <Image
            style={styles.image}
            src={participante.qrHash}
          />
          <Text style={styles.name}>{"#"+participante.id+" - "+participante.name}</Text>
        </View>);
      })}
    </Page>
  </Document>);
}