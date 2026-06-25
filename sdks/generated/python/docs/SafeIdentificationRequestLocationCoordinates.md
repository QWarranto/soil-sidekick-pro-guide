# SafeIdentificationRequestLocationCoordinates


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**latitude** | **float** |  | [optional] 
**longitude** | **float** |  | [optional] 

## Example

```python
from soilsidekick.models.safe_identification_request_location_coordinates import SafeIdentificationRequestLocationCoordinates

# TODO update the JSON string below
json = "{}"
# create an instance of SafeIdentificationRequestLocationCoordinates from a JSON string
safe_identification_request_location_coordinates_instance = SafeIdentificationRequestLocationCoordinates.from_json(json)
# print the JSON string representation of the object
print(SafeIdentificationRequestLocationCoordinates.to_json())

# convert the object into a dict
safe_identification_request_location_coordinates_dict = safe_identification_request_location_coordinates_instance.to_dict()
# create an instance of SafeIdentificationRequestLocationCoordinates from a dict
safe_identification_request_location_coordinates_from_dict = SafeIdentificationRequestLocationCoordinates.from_dict(safe_identification_request_location_coordinates_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


