import React from "react";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles({
  layout: {
    gridArea: (props: any) => {
      return props.gridArea;
    },
    position:'relative'
  },
  cardTitle: {
    textAlign: "center",
  },
  cardContent: { minHeight: "80%" },
});
const SimpleCard = (props: any) => {
  const classes = useStyles(props);

  return (
    <Card className={classes.layout}>
      <CardHeader className={classes.cardTitle} title={props.title} />
      {/* <CardContent className={classes.cardContent}> */}
        {props.children}
      {/* </CardContent> */}
    </Card>
  );
};
export default SimpleCard;
