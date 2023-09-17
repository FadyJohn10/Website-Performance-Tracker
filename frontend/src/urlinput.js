import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const urlSubmit = (e) => {
    e.preventDefault();
    let url = document.getElementById("url").value;
    console.log(url);
    axios.post('http://localhost:5500/urlsubmit', {url})
    .then(res => {
        if(res.data.Status === 'Success'){
            console.log("sent");
        }
    })
    .then(err => console.log(err));
}

function UrlInput(){
    return(
        <InputGroup className="mb-5 mt-4">
        <Form.Control
          type="url" id="url" name="url" placeholder="Enter a website url"
        />
        <Button variant="outline-secondary" id="button-addon2" onClick={urlSubmit}>
          Submit
        </Button>
      </InputGroup>
    )
}
export default UrlInput;