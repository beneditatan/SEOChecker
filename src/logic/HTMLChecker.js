const checkTagCompleteness = (node, attr, attrVal = '') => {
	let valid = false;
	var attrObj = node.attributes;

	// check if node has the attribute specified in attr
	if (attr in attrObj)
	{
		// if user doesnt specify the attribute value, the tag is considered complete regardless of the value
		if (attrVal === '')
		{
			valid = true;
		}
		// if user specifies the attribute value, attribute value should equal as attrVal
		else 
		{
			valid = attrVal == attrObj[attr] ? true : false;
		}
	} 
	else 
	{
		valid = false;
	}

	return valid;
}

const checkTagExist = (root, tag) => {
	const nodes = root.querySelectorAll(tag);

	return nodes

}

const checkNumberOfTag = (root, tag) => {
	const nodes = root.querySelectorAll(tag);

	return nodes.length;

}

module.exports = {
	checkNumberOfTag,
	checkTagCompleteness,
	checkTagExist
};