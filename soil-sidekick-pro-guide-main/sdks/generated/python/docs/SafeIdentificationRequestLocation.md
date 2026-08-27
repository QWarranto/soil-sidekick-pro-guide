# SafeIdentificationRequestLocation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**county_fips** | **str** |  | [optional] 
**state_code** | **str** |  | [optional] 
**coordinates** | [**SafeIdentificationRequestLocationCoordinates**](SafeIdentificationRequestLocationCoordinates.md) |  | [optional] 

## Example

```python
from soilsidekick.models.safe_identification_request_location import SafeIdentificationRequestLocation

# TODO update the JSON string below
json = "{}"
# create an instance of SafeIdentificationRequestLocation from a JSON string
safe_identification_request_location_instance = SafeIdentificationRequestLocation.from_json(json)
# print the JSON string representation of the object
print SafeIdentificationRequestLocation.to_json()

# convert the object into a dict
safe_identification_request_location_dict = safe_identification_request_location_instance.to_dict()
# create an instance of SafeIdentificationRequestLocation from a dict
safe_identification_request_location_form_dict = safe_identification_request_location.from_dict(safe_identification_request_location_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


