const App = {};

App.init = ( data ) => {
	let $chart = $( "#chart" );
	let groupedData = {};
	const CHART_W = $chart.width();
	const CHART_H = $chart.height();

	data.forEach( ( x, i ) => {
		// Transform the data:
		x[ "logMIC" ] = Math.log10( x[ "MIC" ] ) * 100;

		if( !groupedData.hasOwnProperty( x[ "Bacteria" ] ) ) {
			groupedData[ x[ "Bacteria" ] ] = [];
		}

		groupedData[ x[ "Bacteria" ] ].push( x );
	});

	let bacteria = Object.keys( groupedData );
	let numBacteria = bacteria.length;

	// Draw the y-axis:
	let n = 300, i = 0, k = 6, h = CHART_H / k;
	while( i < k ) {
		$( `<div class="chart__axis chart__axisY" />` )
			.css({
				height: h,
				top: i * h
			})
			.html( `<p style="margin-top: -17px">${ n }</p>` )
			.appendTo( $chart );
		n -= 100;
		i++;
	}

	bacteria.forEach( ( b, i ) => {
		let w = CHART_W / numBacteria;

		// Draw the x-axis:
		$( `<div class="chart__axis chart__axisX" />` )
			.css({
				width: w,
				left: i * w
			})
			.text( b )
			.appendTo( $chart );

		// Plot the data:
		let datum = groupedData[ b ];
		let $barGroup = $( `<div class="chart__bar-group" />` )
			.css({
				width: w,
				height: CHART_H,
				left: i * w
			})
			.appendTo( $chart )

		let drawBar = ( d, l ) => {
			let micVal = d[ "logMIC" ];
			const ZERO = 2;
			$( `<div class="chart__bar chart__bar-gram-strain-${ d[ "Gram_Staining" ] }" />` )
				.css({
					height: Math.abs( micVal ) || ZERO,
					top: CHART_H / 2 - ( micVal > 0 ? Math.abs( micVal ) : ZERO ),
					left: l
				})
				.attr( "data-mic", micVal )
				.appendTo( $barGroup );
		};

		const barW = 4;
		const barM = 2;
		drawBar( datum.filter( x => x[ "Antibiotic" ] === "Penicilin" ).pop(), ( w + barW ) / 2 - ( barM * 3 ) );
		drawBar( datum.filter( x => x[ "Antibiotic" ] === "Streptomycin" ).pop(), ( w + barW ) / 2 );
		drawBar( datum.filter( x => x[ "Antibiotic" ] === "Neomycin" ).pop(), ( w + barW ) / 2 + ( barM * 3 ) );
	});
};