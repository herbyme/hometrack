Hometrack Code Test
==========================

To complete this test, you will need to write and deploy a small *NodeJs* API web service, and provide us the URL to your solution. Note: as this is also an exercise in set-up and deployment, please don't solve this by adding an endpoint to an existing app or service. Your service should be standalone and deployed at a root path e.g. with Heroku on http://myservice.herokuapp.com/.

You can take as long as you need to submit your solution, but you should be able to finish it in 4 hours.

## The Test

We'll post some JSON data to the URL you provide. You'll need to filter that data and return a few fields.

## Details

View the request payload json sample provided; from the list of property data in the request payload, return a property record array for items having workflow completed (workflow: completed) for the type 'htv'.

* [request sample](hometrack-sample-request.json)
* [response sample](hometrack-sample-response.json)

The returned JSON should have a response key with an array of properties. Each element should have the following fields from the request:

* Attribute 1: concataddress – a concatenation of the address object fields into a single string
* Attribute 2: type
* Attribute 3: workflow

### Error Handling

If we send invalid JSON, you'll need to return a JSON response with HTTP status 400 Bad Request, and with a `error` key containing the string could not decode request. For example:

```javascript
{
    "error": "Could not decode request: JSON parsing failed"
}
```

### Results

Send us the link to your solution and a link to the code in your github account.

### Useful links

[Heroku](https://www.heroku.com/) - A platform-as-a-service designed for developers, free for small apps.

[github](https://github.com/) - Source code hosting, free repositories for small teams.
