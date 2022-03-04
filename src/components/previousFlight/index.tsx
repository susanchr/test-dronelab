import React, { useContext } from "react";
import SimpleCard from "./../shared/centeredSimpleCard";

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Paper from "@material-ui/core/Paper";

import { HomeStateContext, actionCreator } from "./../../pages/home/reducer";
import MapWidget from "./../map";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layout: {
      height: "79%",
      display: "grid",
      gridTemplateAreas: `
        "left right"
        `,
      gridTemplateColumns: "60% 40%",
    },
    info: {
      gridArea: "right",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      "& table": {
        "& *": {
          "& tr td:nth-of-type(1)": {
            fontWeight: "bolder",
          },
          fontSize: "10px",
        },
      },
    },
    formControl: { width: "100%" },
    select: {
      width: "100%",
    },
    option: {
      cursor: "pointer",
    },
    table: {
      "& td": {
        padding: "2px 0",
      },
    },
  })
);
const PreviousFlight = (props: any) => {
  const classes = useStyles(props);
  const { state, dispatch } = useContext(HomeStateContext);
  return (
    <SimpleCard gridArea={props.gridArea} title="Previous Flight">
      <div className={classes.layout}>
        <MapWidget isInteractive={false} />
        <div className={classes.info}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="previous-flight-dropdown">
              Previous Flight
            </InputLabel>
            <Select
              native
              inputProps={{
                name: "previousflight",
                id: "previous-flight-dropdown",
              }}
              onChange={(
                event: React.ChangeEvent<{ name?: string; value: unknown }>
              ): void => {
                const num = actionCreator.changePreviousFlight(
                  Number(event.target.value)
                );
                dispatch(num);
              }}
              value={state.previousFlight.currentId || 0}
              className={classes.select}
            >
              {state.previousFlight.flightList.map(
                (flight: any, index: number) => {
                  return (
                    <option
                      className={classes.option}
                      value={index}
                      key={index}
                    >
                      {flight.location},{flight.flightTime}
                    </option>
                  );
                }
              )}
            </Select>
            <FormHelperText>Choose a flight from the list above</FormHelperText>
          </FormControl>
          <TableContainer component={Paper}>
            <Table className={classes.table} size={"small"}>
              <TableBody>
                <TableRow>
                  <TableCell>Usage</TableCell>
                  <TableCell>{state.map.usage}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>{state.map.date}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Duration</TableCell>
                  <TableCell>{state.map.duration}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Flight Time</TableCell>
                  <TableCell>{state.map.flightTime}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>{state.map.location}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Weather</TableCell>
                  <TableCell>{state.map.weather}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </SimpleCard>
  );
};
export default PreviousFlight;
