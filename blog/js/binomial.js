function BinomialViewModel() {
	var self = this;

	self.probability = ko.observable(0);
	self.totalNumberOfExperiments = ko.observable(0);

	self.compute = function() {
        var result = [];

        for (var k = 0; k <= self.totalNumberOfExperiments(); k++)
            result[k] = self.computeForK(k);

        $('#result').text(result);
	}

    self.computeForK = function(k) {
        var n = self.totalNumberOfExperiments(),
            binom = self.binomial(n, k),
            p = self.probability();
        return binom * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }

    self.binomial = function(n, k) {
        var numerator = self.factorial(n),
            denumerator = self.factorial(k) * self.factorial(n - k);
        return numerator / denumerator;
    }

    self.factorial = function(x) {
        var result = 1;
        for (var i = 2; i <= x; i++)
            result *= i;
        return result;
    }
}

$(function () {
	var model = new BinomialViewModel();
	ko.applyBindings(model);
});