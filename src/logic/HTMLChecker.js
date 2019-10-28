const checkTagCompleteness = (node, attr, attrVal = '') => {
	let valid = false;
	var attrObj = node.attributes;

	if (attr in attrObj)
	{
		if (attrVal === '')
		{
			valid = true;
		}
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