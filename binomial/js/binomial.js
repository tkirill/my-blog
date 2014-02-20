function BinomialViewModel() {
	var self = this;

	self.probability = ko.observable(0)
	self.totalNumberOfExperiments = ko.observable(0)

	self.compute = function() {
		$('#result').text('Computed with probability='+self.probability()+' and total number of experiments='+self.totalNumberOfExperiments())
	}
}

$(function () {
	var model = new BinomialViewModel();
	ko.applyBindings(model);
});