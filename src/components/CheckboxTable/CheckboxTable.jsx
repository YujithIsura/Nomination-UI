import React from 'react';
import PropTypes, { array } from 'prop-types';
import { withStyles, jssPreset } from '@material-ui/core/styles';
import axios from 'axios';
import ReactDOM from "react-dom";
import MUIDataTable from "mui-datatables";
import Checkbox from '@material-ui/core/Checkbox';
import _ from 'underscore/underscore';
import { setCallElectionData,handleChangeElectionData } from '../../modules/election/state/ElectionAction';
import { connect } from 'react-redux';




const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
});



class CheckboxTableGrid extends React.Component {

    constructor(props) {
        super(props);
        const { CallElectionData } = this.props;

        
        this.state = {
            open: true,
            checkboxGrid: [],
            rowHeaders: [],
            columnHeaders: [],
            rowData: [],
            data: [],
            nominationStart:CallElectionData.nominationStart,
            nominationEnd:CallElectionData.nominationEnd,
            objectionStart:CallElectionData.objectionStart,
            objectionEnd:CallElectionData.objectionEnd,
            depositAmount:CallElectionData.depositAmount,
            WeightagePrefarence:CallElectionData.WeightagePrefarence,
            WeightageVote:CallElectionData.WeightageVote,
            electionName:CallElectionData.electionName,
            electionModule:CallElectionData.electionModule,
        };
    }

    componentWillMount() {
        const { rows,cols,CallElectionData } = this.props;

        let rowHeaders = [''];
        this.props.rows.map((value) => {
            rowHeaders.push(value.name);
        });

        let columnHeaders = ['', 'Select All'];
        this.props.cols.map((value) => {
            columnHeaders.push(value.name);
        });

        let checkboxGrid = [];
        rowHeaders.map(() => {
            let row = [];
            columnHeaders.map(() => {
                row.push(false);
            });
            checkboxGrid.push(row);
        });

        var rawCount=0;
        for (let i = 0; i < rows.length; i++) {
            let row = [];
            var colCount=0;
            rawCount++;
            for (let j = 0; j < cols.length; j++) {
                    for (let h = 0; h <  CallElectionData.rowData.length; h++) {
                        if(cols[j].id===CallElectionData.rowData[h].division_id && rows[i].id===CallElectionData.rowData[h].team_id){
 
                        let allow_party = {
                            'division_id': CallElectionData.rowData[h].division_id,
                            'team_id': CallElectionData.rowData[h].team_id,
                            'id': (i+1) + '-' + (j+1)
                        }
                        this.state.rowData.push(allow_party);
                    
                    }
                }
                // row.push(false);
            }
            // checkboxGrid.push(colData);
        }
        this.setState({ rowData:this.state.rowData });

        this.setState({ rowHeaders, columnHeaders, checkboxGrid });
        var rawCount=0;
        var prevCol = cols[0].id;
        var colCount=0;
        var selectedIndex='';
        for (let i = 0; i < rows.length; i++) {
            let row = [];
            for (let j = 0; j < cols.length; j++) {
                CallElectionData.rowData.map((value) => {
                    if(cols[j].id===value.division_id && rows[i].id===value.team_id){
                        if (prevCol === cols[j].id){
                            colCount++;
                            prevCol=cols[j].id;
                            selectedIndex=j;
                            console.log(colCount);  
                        }else{
                            if(j!==cols.length-1){
                                prevCol=cols[j+1].id;
                            }
                        }

                        rawCount++;
                        // console.log("rowIndex->"+i+"colIndex->"+cols[j].id+"colCount->"+colCount+"rowCount->"+rawCount);
                        checkboxGrid[i+1][j+1] = true;
                    }

                    // if(colCount == cols.length){
                    //     console.log("selectedIndex",selectedIndex);
                    //     // for (let x = 0; x < cols.length+1; x++) {
                    //         checkboxGrid[selectedIndex+1][0] = true;
                    //     // }
                    // }
                    // if(colCount == cols.length){
                    //     for (let y = 0; y < rows.length+1; y++) {
                    //         checkboxGrid[y][0] = true;
                    //     }
                    // }
                        
                });
                // row.push(false);
            }
            // checkboxGrid.push(colData);
        }
        this.findIndex(checkboxGrid);

    }


    findIndex(checkboxGrid){
        debugger;

        for (let j = 0; j < checkboxGrid.length; j++) {
            if(checkboxGrid[0][j]){

            }
        }
    }
    // this will handle the change of checkbox and update the state.checkboxGrid variable, which is the source to the grid.
    handleChange = (row, col, data) => (event, value) => {
        const { setCallElectionData,electionData ,handleChangeElectionData} = this.props;
        const newElectionModule = {...this.props.CallElectionData};
        let checkboxGrid = Array.from(this.state.checkboxGrid);
        debugger;
        let params = {
            event: event,
            row: row,
            col: col,
            value: value
        }
        
        if ((col == 0) & (row != 0)) {
            this.setValue('rows', params)
        } else if ((col != 0) && (row == 0)) {
            this.setValue('columns', params)
        } else if ((col == 0) && (row == 0)) {
            this.setValue('all', params);
        } else {
            this.setValue('single', params)
        }
        console.log("this.state.rowData",this.state.rowData);
        checkboxGrid[row][col] = event.target.checked;
        newElectionModule.rowData = this.state.rowData;
        handleChangeElectionData(newElectionModule);
        this.setState({ checkboxGrid });
        // setCallElectionData(this.state);

    };


    setRows = (params) => {
        const { electionData,handleChangeElectionData } = this.props;
        const newElectionModule = {...this.props.CallElectionData};
        debugger;
        let checkboxGrid = Array.from(this.state.checkboxGrid);
        console.log("checkboxGrid",checkboxGrid);
        for (let i = 0; i < this.props.cols.length; i++) {
            checkboxGrid[params.row][i + 1] = params.event.target.checked;
            if (params.value) {
                let allow_party = {
                    'division_id': this.props.cols[i].id,
                    'team_id': this.props.rows[params.row - 1].id,
                    'election_id': electionData.election_id,
                    'id': params.row + '-' + (i + 1)
                }
                this.state.rowData.push(allow_party);
            } else {
                this.removeValue(params.row + '-' + (i + 1))
            }

        }
        // newElectionModule.rowData = this.state.rowData;
        // handleChangeElectionData(newElectionModule);
    }

    setColumns = (params) => {
        const { electionData,handleChangeElectionData } = this.props;
        const newElectionModule = {...this.props.CallElectionData};
        debugger;
        let checkboxGrid = Array.from(this.state.checkboxGrid);
        for (let i = 0; i < this.props.rows.length; i++) {
            checkboxGrid[i + 1][params.col] = params.event.target.checked;
            if (params.value) {
                let allow_party = {
                    'division_id': this.props.cols[params.col - 1].id,
                    'team_id': this.props.rows[i].id,
                    'election_id': electionData.election_id,
                    'id': (i + 1) + '-' + params.col
                }
                this.state.rowData.push(allow_party);
            } else {
                this.removeValue((i + 1) + '-' + params.col)
            }
        }
        // newElectionModule.rowData = this.state.rowData;
        // console.log("newElectionModule.rowData",this.state.rowData);
        // handleChangeElectionData(newElectionModule);
    }


    setValue = (value, params) => {
        console.log(this.props.rows);
        let rowNew = [''];
        this.props.rows.map((value) => {
            rowNew.push({name:value.name,id:value.id});
        });
        let colNew = [''];
        this.props.cols.map((value) => {
            colNew.push({name:value.name,id:value.id});
        });
        debugger;
        const { electionData } = this.props;
        let checkboxGrid = Array.from(this.state.checkboxGrid);
        switch (value) {
            case 'rows':
                this.setRows(params);
                break;

            case 'columns':

                this.setColumns(params);
                break;
            case 'all':

                for (let i = 0; i < this.props.rows.length+1; i++) {
                    checkboxGrid[i][0] = params.event.target.checked;
                    for (let j = 1; j < this.props.cols.length + 1; j++) {
                    checkboxGrid[0][j] = params.event.target.checked;
                        let param = {
                            col: j,
                            row: i,
                            event: params.event,
                            value: params.value
                        }
                        this.setColumns(param)
                    }
                }
                break;
            default:

                if (params.value) {
                    let allow_party = {
                        'division_id': colNew[params.col].id,
                        'team_id': rowNew[params.row].id,
                        'election_id': electionData.election_id,
                        'id': (params.row) + '-' + (params.col)
                    }
                    this.state.rowData.push(allow_party);
                } else {
                    this.removeValue((params.row) + '-' + (params.col))
                }

        }

        this.state.rowData = _.uniq(this.state.rowData, function (data) {
            return data.id
        })
    }

    removeValue = (id) => {
debugger;
        this.state.rowData = _.without(this.state.rowData, _.findWhere(this.state.rowData, {
            id: id
        }));
        
    }


    render() {
        const { data,CallElectionData } = this.props;
        const { rows,cols } = this.props;
        const { rowHeaders,columnHeaders } = this.state;
debugger;
        var checkboxGrid=this.state.checkboxGrid;
        // debugger;
        // rows.map((rows) => {
        //     let row = [];
        //     cols.map((cols) => {
        //         let rowIndex = 
        //         CallElectionData.rowData.map((value) => {
        //             if(cols.id===value.division_id && rows.id===value.team_id){
        //                 row.push(true);
        //             }
        //             // else if(rows.id===value.team_id){
        //             //     console.log(rows.id);
        //             //     row.push(false);
        //             // }
        //         });
        //         row.push(false);
        //         // if(rows.id===value.team_id){
        //         //         console.log(rows.id);
        //         //     }
        //     });
        //     checkboxGrid.push(row);
        // });
        // console.log(checkboxGrid);
        // debugger;

        // let checkboxGrid = [];
     
        // let checkboxGrid = [];
        // var colData = [];
        // for (let i = 0; i < rows.length; i++) {
        //      colData[i] = [];
        //     for (let j = 0; j < cols.length; j++) {
        //         CallElectionData.rowData.map((value) => {
        //             if(cols.id===value.division_id && rows.id===value.team_id){
        //                 colData[i].push(true)
        //             }
        //             // else if(rows.id===value.team_id){
        //             //     console.log(rows.id);
        //             //     row.push(false);
        //             // }
        //         });
                
        //     }
        //     checkboxGrid.push(colData);
        // }
        debugger;
        // this is written here so that `checked={this.state.checkboxGrid[i][j-1]}` could work.
        // on this way updated checkbox data is always taken from state and setup properly
        let rowData = [];
        for (let i = 0; i < this.state.rowHeaders.length; i++) {
            let colData = [];
            for (let j = 0; j < this.state.columnHeaders.length; j++) {
                if (j == 0) {
                    colData.push(this.state.rowHeaders[i]);
                } else {
                    colData.push(<Checkbox color="primary" checked={this.state.checkboxGrid[i][j - 1]} onChange={this.handleChange(i, j - 1, data)}></Checkbox>);
                }
            }
            rowData.push(colData);
        }

        // set row data headers
        const outputData = rowData.map(Object.values);
        // const outputData = CallElectionData.rowData.map(Object.values);

        
        // set column data
        const columns = this.state.columnHeaders;

        // set option list
        const options = {
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows: false,
        };

        return (
            <MUIDataTable
                title={this.props.title}
                data={outputData}
                columns={columns}
                options={options}
            />
        );
    }
}


const mapStateToProps = ({ Election }) => {
    const { setCallElectionData  } = Election;
    const CallElectionData  = Election.CallElectionData;
    const electionData = Election.electionData;


    return {  setCallElectionData, CallElectionData,electionData }
  };
  
  const mapActionsToProps = {
    setCallElectionData,
    handleChangeElectionData
  };
  
  export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(CheckboxTableGrid));
  