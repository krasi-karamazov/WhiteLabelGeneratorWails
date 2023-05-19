export namespace main {
	
	export class PropertiesData {
	    name: string;
	    data: string[];
	
	    static createFrom(source: any = {}) {
	        return new PropertiesData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.data = source["data"];
	    }
	}
	export class SaveError {
	    error: string;
	    type: string;
	
	    static createFrom(source: any = {}) {
	        return new SaveError(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.error = source["error"];
	        this.type = source["type"];
	    }
	}

}

