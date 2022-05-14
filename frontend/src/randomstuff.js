<Droppable droppableId='NPPES'>
          {() => (
            <FormControlLabel 
              label="NPPES"
              control={
                <Checkbox 
                  defaultChecked
                  onChange={() => props.callback("NPPES")}
                />
              }
            /> 
          )}
          </Droppable>
          <Droppable  droppableId='SAMASA'>
          {() => (
            <FormControlLabel 
            label="SAMASA" 
            control={
              <Checkbox
                defaultChecked
                onChange={() => props.callback("SAMASA")}
              />
            }
          />
          )}
          </Droppable>
          <Droppable  droppableId='Project_Down'>
          {() => (
          <FormControlLabel 
            label="Project_Down" 
            control={
              <Checkbox 
                defaultChecked
                onChange={() => props.callback("Project_Down")}
              />
            }
          />
          )}
          </Droppable>
          <Droppable  droppableId='zipcodes'>
          {() => (
           <FormControlLabel 
            label="Zipcode boundaries" 
            control={
              <Checkbox 
                defaultChecked
                onChange={() => props.callback("zipcodes")}
              />
            }
          />
          )}
          </Droppable>
          <Droppable  droppableId='jackson'> 
          {() => (
            <FormControlLabel 
            label="Jackson county outline and fill" 
            control={
              <Checkbox 
                defaultChecked
                onChange={() => props.callback("Jackson")}
              />
            }
          />
          )}
          </Droppable>
          <Droppable  droppableId='scioto'>
            {() => (
          <FormControlLabel 
            label="Scioto County Outline and Fill" 
            control={
              <Checkbox 
                defaultChecked
                onChange={() => props.callback("Scioto")}
              />
            }
          />)}
          </Droppable>